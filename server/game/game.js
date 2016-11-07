const _ = require('underscore');
const EventEmitter = require('events');
const uuid = require('node-uuid');

const cards = require('./cards');

class Game extends EventEmitter {
    constructor(owner, name) {
        super();

        this.players = {};
        this.playerPlots = {};
        this.playerCards = {};
        this.messages = [];

        this.name = name;
        this.id = uuid.v1();
        this.owner = owner;
        this.started = false;
    }

    addMessage(message) {
        this.messages.push({ date: new Date(), message: message });
    }

    getState(activePlayer) {
        var playerState = {};

        if (this.started) {
            _.each(this.players, player => {
                playerState[player.id] = player.getState(activePlayer === player.id);
            });

            return {
                name: this.name,
                owner: this.owner,
                players: playerState,
                messages: this.messages
            };
        }

        return this.getSummary(activePlayer);
    }

    getSummary(activePlayer) {
        var playerSummaries = [];

        _.each(this.players, player => {
            var deck = undefined;

            if (activePlayer === player.id && player.deck) {
                deck = { name: player.deck.name };
            } else if (player.deck) {
                deck = {};
            }

            playerSummaries.push({ id: player.id, name: player.name, deck: deck, owner: player.owner });
        });

        return {
            id: this.id,
            name: this.name,
            owner: this.owner,
            started: this.started,
            players: playerSummaries
        };
    }

    startGameIfAble() {
        if (_.all(this.players, player => {
            return player.readyToStart;
        })) {
            _.each(this.players, player => {
                player.startGame();
            });
        }
    }

    mulligan(playerId) {
        var player = this.players[playerId];

        player.mulligan();

        this.addMessage(player.name + ' has taken a mulligan');
    }

    keep(playerId) {
        var player = this.players[playerId];

        player.keep();
        this.addMessage(player.name + ' has kept their hand');
    }

    playCard(playerId, card) {
        var player = this.players[playerId];

        this.stopCardPlay = false;
        this.emit('beforeCardPlayed', this, player, card);
        if (this.stopCardPlay) {
            return;
        }

        if (!player.playCard(card)) {
            return;
        }

        this.emit('afterCardPlayed', this, player, card);

        var cardImplemation = cards[card.code];
        if (cardImplemation && cardImplemation.register) {
            cardImplemation.register(this, player, card);
        }
    }

    checkForAttachments() {
        var playersWithAttachments = _.filter(this.players, p => {
            return p.hasUnmappedAttachments();
        });
        var playersWaiting = _.filter(this.players, p => {
            return !p.hasUnmappedAttachments();
        });

        if (playersWithAttachments.length !== 0) {
            _.each(playersWithAttachments, p => {
                p.menuTitle = 'Select attachment locations';
                p.buttons = [
                    { command: 'mapattachments', text: 'Done' }
                ];
                p.waitingForAttachments = true;
            });

            _.each(playersWaiting, p => {
                p.menuTitle = 'Waiting for opponent to finish setup';
                p.buttons = [];
            });
        } else {
            _.each(this.players, p => {
                p.postSetup();
                p.startPlotPhase();
            });
        }
    }

    setupDone(playerId) {
        var player = this.players[playerId];

        player.setupDone();

        this.addMessage(player.name + ' has finished setup');

        if (!_.all(this.players, p => {
            return p.setup;
        })) {
            player.menuTitle = 'Waiting for opponent to finish setup';
            player.buttons = [];
        } else {
            this.checkForAttachments();
        }
    }

    firstPlayerPrompt(highestPlayer) {
        highestPlayer.firstPlayer = true;
        highestPlayer.menuTitle = 'Select a first player';
        highestPlayer.buttons = [
            { command: 'firstplayer', text: 'Me', arg: 'me' }
        ];

        if (_.size(this.players) > 1) {
            highestPlayer.buttons.push({ command: 'firstplayer', text: 'Opponent', arg: 'opponent' });
        }

        var otherPlayer = _.find(this.players, player => {
            return player.id !== highestPlayer.id;
        });

        if (otherPlayer) {
            otherPlayer.menuTitle = 'Waiting for opponent to select first player';
            otherPlayer.buttons = [];
        }
    }

    selectPlot(playerId, plot) {
        var player = this.players[playerId];

        if (!player.selectPlot(plot)) {
            return;
        }

        var plotImplementation = cards[player.selectedPlot.card.code];
        if (plotImplementation && plotImplementation.register) {
            plotImplementation.register(this, player);
        }

        this.addMessage(player.name + ' has selected a plot');

        if (!_.all(this.players, p => {
            return !!p.selectedPlot;
        })) {
            player.menuTitle = 'Waiting for opponent to select plot';
            player.buttons = [];
        } else {
            var highestPlayer = undefined;
            var highestInitiative = -1;
            _.each(this.players, p => {
                if (p.selectedPlot.card.initiative > highestInitiative) {
                    highestInitiative = p.selectedPlot.card.initiative;
                    highestPlayer = p;
                }
            });

            _.each(this.players, p => {
                p.revealPlot();
            });

            this.firstPlayerPrompt(highestPlayer);
        }
    }

    beginMarshal(player) {
        this.emit('beginMarshal', this, player);

        player.beginMarshal();

        var otherPlayer = _.find(this.players, p => {
            return player.id !== p.id;
        });

        if (otherPlayer) {
            otherPlayer.menuTitle = 'Waiting for opponent to marshal their cards';
            otherPlayer.buttons = [];
        }
    }

    revealDone(player) {
        var otherPlayer = _.find(this.players, p => {
            return p.id !== player.id;
        });

        player.revealFinished = true;

        if (otherPlayer && !otherPlayer.revealFinished) {
            this.revealPlot(otherPlayer);

            return;
        }

        if (!otherPlayer) {
            this.beginMarshal(player);

            return;
        }

        var firstPlayer = player.firstPlayer ? player : otherPlayer;

        if (player.plotRevealed && otherPlayer.plotRevealed) {
            this.beginMarshal(firstPlayer);
        }
    }

    revealPlot(player) {
        this.pauseForPlot = false;
        this.emit('plotRevealed', this, player);

        if (!this.pauseForPlot) {
            this.revealDone(player);
        }
    }

    setFirstPlayer(sourcePlayer, who) {
        var firstPlayer = undefined;

        var player = this.players[sourcePlayer];

        _.each(this.players, player => {
            if (player.id === sourcePlayer && who === 'me') {
                player.firstPlayer = true;
                firstPlayer = player;
            } else if (player.id !== sourcePlayer && who !== 'me') {
                player.firstPlayer = true;
                firstPlayer = player;
            } else {
                player.firstPlayer = false;
            }

            player.drawPhase();
            player.menuTitle = '';
            player.buttons = [];
        });

        this.addMessage(player.name + ' has selected ' + firstPlayer.name + ' to be the first player');

        this.revealPlot(firstPlayer);
    }

    attachCard(player, card) {
        this.canAttach = true;
        this.emit('beforeAttach', this, player, card);
        if (!this.canAttach) {
            return;
        }

        player.removeFromHand(player.selectedAttachment);

        var targetPlayer = this.players[card.owner];
        targetPlayer.attach(player.selectedAttachment, card);
        player.selectCard = false;

        if (targetPlayer === player && player.phase === 'setup') {
            // We put attachments on the board during setup, now remove it
            player.cardsInPlay = _.reject(player.cardsInPlay, c => {
                return c.card.uuid === player.selectedAttachment.uuid;
            });
        }

        player.selectedAttachment = undefined;

        if (player.phase === 'setup') {
            this.checkForAttachments();
        } else {
            player.buttons = [{ command: 'donemarshal', text: 'Done' }];
            player.menuTitle = 'Marshal your cards';
        }
    }

    handleChallenge(player, otherPlayer, card) {
        var cardInPlay = player.findCardInPlayByUuid(card.uuid);

        if (!cardInPlay) {
            if (!player.pickingStealth) {
                return false;
            }

            if (otherPlayer) {
                var otherCardInPlay = otherPlayer.findCardInPlayByUuid(card.uuid);

                if (!otherCardInPlay) {
                    return false;
                }

                if (!otherPlayer.addToStealth(otherCardInPlay.card)) {
                    return false;
                }

                this.addMessage(player.name + ' has chosen ' + otherCardInPlay.card.label + ' as a stealth target');
                player.stealthCard.stealthTarget = otherCardInPlay;

                if (this.doStealth(player)) {
                    return true;
                }
            }
        } else {
            if (!player.selectingChallengers || cardInPlay.kneeled) {
                return false;
            }

            var challengeCard = player.canAddToChallenge(card);
            if (!challengeCard) {
                return false;
            }

            this.canAddToChallenge = true;
            this.emit('beforeChallengerSelected', this, player, challengeCard);

            if (this.canAddToChallenge) {
                player.addToChallenge(challengeCard);
            }
        }

        return true;
    }

    handleClaim(player, otherPlayer, card) {
        if (card.type_code !== 'character') {
            return;
        }

        player.killCharacter(card);

        if (player.claimToDo === 0) {
            player.doneClaim();

            if (otherPlayer) {
                otherPlayer.beginChallenge();
            }
        }
    }

    processCardClicked(player, card) {
        var otherPlayer = _.find(this.players, p => {
            return p.id !== player.id;
        });

        if (player.setPower) {
            var cardInPlay = player.findCardInPlayByUuid(card.uuid);

            if (!cardInPlay) {
                return false;
            }

            cardInPlay.power = player.setPower;

            this.addMessage(player.name + ' uses the /power command to set the power of ' + cardInPlay.card.label + ' to ' + player.setPower);
            this.doneSetPower(player.id);

            return true;
        }

        this.clickHandled = false;
        this.emit('cardClicked', this, player, card);
        if (this.clickHandled) {
            return true;
        }

        if (player.phase === 'setup' && !player.waitingForAttachments) {
            return false;
        }

        if ((player.phase === 'setup' || player.phase === 'marshal') && player.selectedAttachment) {
            this.attachCard(player, card);

            return true;
        }

        if (player.phase === 'challenge' && player.currentChallenge) {
            return this.handleChallenge(player, otherPlayer, card);
        }

        if (player.phase === 'claim' && player.currentChallenge === 'military') {
            this.handleClaim(player, otherPlayer, card);

            return true;
        }

        if (player.phase !== 'setup' || card.type_code !== 'attachment') {
            return false;
        }

        player.selectedAttachment = card;
        player.selectCard = true;
        player.menuTitle = 'Select target for attachment';

        return true;
    }

    cardClicked(sourcePlayer, card) {
        var player = this.players[sourcePlayer];

        if (!player) {
            return;
        }

        if (!this.processCardClicked(player, card)) {
            var cardInPlay = player.findCardInPlayByUuid(card.uuid);

            if (cardInPlay) {
                cardInPlay.kneeled = !cardInPlay.kneeled;
            }
        }
    }

    showDrawDeck(playerId) {
        var player = this.players[playerId];

        if (!player.showDeck) {
            player.showDrawDeck();

            this.addMessage(player.name + ' is looking at their deck');
        } else {
            player.showDeck = false;

            this.addMessage(player.name + ' stops looking at their deck');
        }
    }

    drop(playerId, card, source, target) {
        var player = this.players[playerId];

        if (player.drop(card, source, target)) {
            this.addMessage(player.name + ' has moved a card from their ' + source + ' to their ' + target);
        }
    }

    marshalDone(playerId) {
        var player = this.players[playerId];

        player.marshalDone();

        this.addMessage(player.name + ' has finished marshalling');

        var unMarshalledPlayer = _.find(this.players, p => {
            return !p.marshalled;
        });

        if (unMarshalledPlayer) {
            player.menuTitle = 'Waiting for opponent to finish marshalling';
            player.buttons = [];

            this.beginMarshal(unMarshalledPlayer);
        } else {
            var firstPlayer = _.find(this.players, p => {
                return p.firstPlayer;
            });

            firstPlayer.beginChallenge();

            var otherPlayer = _.find(this.players, p => {
                return p.id !== firstPlayer.id;
            });

            if (otherPlayer) {
                otherPlayer.menuTitle = 'Waiting for opponent to initiate challenge';
                otherPlayer.buttons = [];
            }
        }
    }

    startChallenge(playerId, challengeType) {
        var player = this.players[playerId];

        if (player.challenges.complete >= player.challenges.maxTotal) {
            return;
        }

        if (player.challenges[challengeType].performed >= player.challenges[challengeType].max) {
            return;
        }

        player.challengeType = challengeType;

        this.cancelChallenge = false;
        this.emit('beforeChallenge', this, player, challengeType);
        if (this.cancelChallenge) {
            return;
        }

        player.startChallenge(challengeType);
    }

    doStealth(player) {
        var stealthCard = _.find(player.cardsInChallenge, card => {
            return !card.stealthTarget && this.hasKeyword(card.card, 'Stealth');
        });

        if (stealthCard) {
            player.menuTitle = 'Select stealth target for ' + stealthCard.card.label;
            player.buttons = [
                { command: 'donestealth', text: 'Done' }
            ];
            player.stealthCard = stealthCard;
            player.selectCard = true;
            player.pickingStealth = true;

            return true;
        }

        this.addMessage(player.name + ' has initiated a ' + player.currentChallenge + ' challenge with strength ' + player.challengeStrength);

        var otherPlayer = _.find(this.players, p => {
            return p.id !== player.id;
        });

        if (otherPlayer) {
            player.menuTitle = 'Waiting for opponent to defend';
            player.buttons = [];

            otherPlayer.beginDefend(player.currentChallenge);
        }

        return false;
    }

    doneChallenge(playerId) {
        var player = this.players[playerId];

        if (!_.any(player.cardsInPlay, card => {
            return card.selected;
        })) {
            player.beginChallenge();
            return;
        }

        var otherPlayer = _.find(this.players, p => {
            return p.id !== player.id;
        });

        player.doneChallenge(true);
        if (otherPlayer) {
            otherPlayer.currentChallenge = player.currentChallenge;
        }

        this.doStealth(player);
    }

    doneDefend(playerId) {
        var player = this.players[playerId];

        player.doneChallenge(false);

        this.addMessage(player.name + ' has defended with strength ' + player.challengeStrength);

        var challenger = _.find(this.players, p => {
            return p.id !== player.id;
        });

        var winner = undefined;
        var loser = undefined;

        if (challenger) {
            if (challenger.challengeStrength >= player.challengeStrength) {
                loser = player;
                winner = challenger;
            } else {
                loser = challenger;
                winner = player;
            }

            winner.challenges[winner.currentChallenge].won++;

            this.addMessage(winner.name + ' won a ' + winner.currentChallenge + '  challenge ' +
                winner.challengeStrength + ' vs ' + loser.challengeStrength);

            this.emit('afterChallenge', this, winner.currentChallenge, winner, loser);

            if (loser.challengeStrength === 0) {
                winner.power++;

                this.addMessage(winner.name + ' has gained 1 power from an unopposed challenge');

                if (winner.getTotalPower() > 15) {
                    this.addMessage(winner.name + ' has won the game');
                }
            }

            // XXX This should be after claim but needs a bit of reworking to make that possible            
            this.applyKeywords(winner, loser);

            if (winner === challenger) {
                this.applyClaim(winner, loser);
            } else {
                challenger.beginChallenge();

                player.menuTitle = 'Waiting for opponent to initiate challenge';
                player.buttons = [];
            }
        }
    }

    hasKeyword(card, keyword) {
        return card.text.indexOf(keyword + '.') !== -1;
    }

    applyKeywords(winner, loser) {
        _.each(winner.cardsInChallenge, card => {
            if (this.hasKeyword(card.card, 'Insight')) {
                winner.drawCardsToHand(1);

                this.addMessage(winner.name + ' draws a card from Insight on ' + card.card.label);
            }

            if (this.hasKeyword(card.card, 'Intimidate')) {
                // something
            }

            if (this.hasKeyword(card.card, 'Pillage')) {
                loser.discardFromDraw(1);

                this.addMessage(loser.name + ' discards a card from the top of their deck from Pillage on ' + card.card.label);
            }

            if (this.hasKeyword(card.card, 'Renown')) {
                card.power++;

                this.addMessage(winner.name + ' gains 1 power on ' + card.card.label + ' from Renown');
            }

            if (winner.getTotalPower() > 15) {
                this.addMessage(winner.name + ' has won the game');
            }
        });
    }

    applyClaim(winner, loser) {
        this.emit('beforeClaim', this, winner.currentChallenge, winner, loser);
        var claim = winner.activePlot.card.claim;

        if (claim <= 0) {
            this.addMessage('The claim value for ' + winner.currentChallenge + ' is 0, no claim occurs');
        } else {
            if (winner.currentChallenge === 'military') {
                winner.menuTitle = 'Waiting for opponent to apply claim effects';
                winner.buttons = [];

                loser.claimToDo = claim;
                loser.selectCharacterToKill();

                return;
            } else if (winner.currentChallenge === 'intrigue') {
                loser.discardAtRandom(claim);
            } else if (winner.currentChallenge === 'power') {
                if (loser.power > 0) {
                    loser.power -= claim;
                    winner.power += claim;

                    if (winner.getTotalPower() > 15) {
                        this.addMessage(winner.name + ' has won the game');
                    }
                }
            }
        }

        this.emit('afterClaim', this, winner.currentChallenge, winner, loser);
        loser.doneClaim();
        winner.beginChallenge();
    }

    doneChallenges(playerId) {
        var challenger = this.players[playerId];

        challenger.doneChallenges = true;

        var other = _.find(this.players, p => {
            return !p.doneChallenges;
        });

        if (other) {
            other.beginChallenge();

            challenger.menuTitle = 'Waiting for opponent to initiate challenge';
            challenger.buttons = [];
        } else {
            this.dominance();
        }
    }

    dominance() {
        var highestDominance = 0;
        var highestPlayer = undefined;

        _.each(this.players, player => {
            player.phase = 'dominance';
            var dominance = player.getDominance();

            if (dominance > highestDominance) {
                highestPlayer = player;
            }
        });

        if (!highestPlayer) {
            _.each(this.players, p => {
                highestPlayer = p;
            });
        }

        this.addMessage(highestPlayer.name + ' wins dominance');

        highestPlayer.power++;

        if (highestPlayer.getTotalPower() > 15) {
            this.addMessage(highestPlayer.name + ' has won the game');
        }

        this.emit('afterDominance', this, highestPlayer);

        this.emit('cardsStanding', this);

        _.each(this.players, player => {
            player.standCards();
            player.taxation();
        });

        var firstPlayer = _.find(this.players, p => {
            return p.firstPlayer;
        });

        firstPlayer.menuTitle = '';
        firstPlayer.buttons = [
            { command: 'doneround', text: 'End Turn' }
        ];

        var otherPlayer = _.find(this.players, p => {
            return p.id !== firstPlayer.id;
        });

        if (otherPlayer) {
            otherPlayer.menuTitle = 'Waiting for opponent to end their turn';
            otherPlayer.buttons = [];
        }
    }

    doneRound(playerId) {
        var player = this.players[playerId];

        if (player.hand.length > player.reserve) {
            return;
        }
        var otherPlayer = _.find(this.players, p => {
            return p.id !== player.id;
        });

        if (!otherPlayer) {
            player.startPlotPhase();

            var plotImplementation = cards[player.activePlot.card.code];
            if (plotImplementation && plotImplementation.unregister) {
                plotImplementation.unregister(this, player);
            }

            return;
        }

        if (otherPlayer && otherPlayer.roundDone) {
            player.startPlotPhase();
            otherPlayer.startPlotPhase();

            plotImplementation = cards[player.activePlot.card.code];
            if (plotImplementation && plotImplementation.unregister) {
                plotImplementation.unregister(this, player);
            }

            plotImplementation = cards[otherPlayer.activePlot.card.code];
            if (plotImplementation && plotImplementation.unregister) {
                plotImplementation.unregister(this, otherPlayer);
            }

            return;
        }

        player.roundDone = true;
        player.menuTitle = 'Waiting for opponent to end their turn';
        player.buttons = [];

        if (otherPlayer) {
            otherPlayer.menuTitle = '';
            otherPlayer.buttons = [
                { command: 'doneround', text: 'End Turn' }
            ];
        }
    }

    changeStat(playerId, stat, value) {
        var player = this.players[playerId];

        player[stat] += value;

        if (player[stat] < 0) {
            player[stat] = 0;
        } else {
            this.addMessage(player.name + ' sets ' + stat + ' to ' + player[stat] + ' (' + (value > 0 ? '+' : '') + value + ')');
        }
    }

    customCommand(playerId, arg) {
        var player = this.players[playerId];

        this.emit('customCommand', this, player, arg);
    }

    getNumberOrDefault(string, defaultNumber) {
        var num = parseInt(string);

        if (isNaN(num)) {
            num = defaultNumber;
        }

        if (num < 0) {
            num = defaultNumber;
        }

        return num;
    }

    chat(playerId, message) {
        var player = this.players[playerId];
        var args = message.split(' ');
        var num = 1;

        if (message.indexOf('/draw') !== -1) {
            if (args.length > 1) {
                num = this.getNumberOrDefault(args[1], 1);
            }

            this.addMessage(player.name + ' uses the /draw command to draw ' + num + ' cards to their hand');

            player.drawCardsToHand(num);

            return;
        }

        if (message.indexOf('/power') !== -1) {
            if (args.length > 1) {
                num = this.getNumberOrDefault(args[1], 1);
            }

            player.selectCard = true;
            player.oldMenuTitle = player.menuTitle;
            player.oldButtons = player.buttons;
            player.menuTitle = 'Select a card to set power for';
            player.buttons = [
                { command: 'donesetpower', text: 'Done' }
            ];
            player.setPower = num;

            return;
        }

        this.addMessage('<' + player.name + '> ' + message);
    }

    doneSetPower(playerId) {
        var player = this.players[playerId];

        player.menuTitle = player.oldMenuTitle;
        player.buttons = player.oldButtons;
        player.selectCard = false;

        player.oldMenuTitle = undefined;
        player.oldButtons = undefined;
        player.setPower = undefined;
    }

    playerLeave(playerId, reason) {
        var player = this.players[playerId];

        this.addMessage(player.name + ' ' + reason);
    }

    concede(playerId) {
        var player = this.players[playerId];

        if (!player) {
            return;
        }

        this.addMessage(player.name + ' concedes');

        var otherPlayer = _.find(this.players, p => {
            return p.id !== playerId;
        });

        if (otherPlayer) {
            this.addMessage(otherPlayer.name + ' wins the game');
        }
    }

    selectDeck(playerId, deck) {
        var player = this.players[playerId];

        if (!player) {
            return;
        }

        player.selectDeck(deck);
    }

    doneStealth(playerId) {
        var player = this.players[playerId];

        if (!player) {
            return;
        }

        var otherPlayer = _.find(this.players, p => {
            return p.id !== player.id;
        });

        if (otherPlayer) {
            player.menuTitle = 'Waiting for opponent to defend';
            player.buttons = [];

            otherPlayer.beginDefend(player.currentChallenge);
        }

        return false;
    }

    cancelClaim(playerId) {
        var player = this.players[playerId];

        this.addMessage(player.name + ' has cancelled claim effects');

        player.doneClaim();

        var otherPlayer = _.find(this.players, p => {
            return p !== player.id;
        });

        if (otherPlayer) {
            otherPlayer.beginChallenge();
        }
    }

    shuffleDeck(playerId) {
        var player = this.players[playerId];

        this.addMessage(player.name + ' shuffles their deck');

        player.shuffleDrawDeck();
    }

    initialise() {
        _.each(this.players, player => {
            player.initialise();
        });
    }
}

module.exports = Game;
