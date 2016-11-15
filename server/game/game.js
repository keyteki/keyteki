const _ = require('underscore');
const EventEmitter = require('events');
const uuid = require('node-uuid');

const cards = require('./cards');
const Player = require('./player.js');

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
        this.playStarted = false;
    }

    addMessage(message) {
        this.messages.push({ date: new Date(), message: message });
    }

    isSpectator(player) {
        return player.constructor !== Player;
    }

    getPlayers() {
        var players = {};

        _.reduce(this.players, (playerList, player) => {
            if(!this.isSpectator(player)) {
                playerList[player.id] = player;
            }

            return playerList;
        }, players);

        return players;
    }

    getPlayersAndSpectators() {
        return this.players;
    }

    getSpectators() {
        var spectators = [];

        _.reduce(this.players, (spectators, player) => {
            if(this.isSpectator(player)) {
                spectators.push(player);
            }

            return spectators;
        }, spectators);

        return spectators;
    }

    getState(activePlayer) {
        var playerState = {};

        if(this.started) {
            _.each(this.getPlayers(), player => {
                playerState[player.id] = player.getState(activePlayer === player.id);
            });

            return {
                id: this.id,
                name: this.name,
                owner: this.owner,
                players: playerState,
                messages: this.messages,
                spectators: _.map(this.getSpectators(), spectator => {
                    return {
                        id: spectator.id,
                        name: spectator.name
                    };
                }),
                started: this.started
            };
        }

        return this.getSummary(activePlayer);
    }

    getSummary(activePlayer) {
        var playerSummaries = [];

        _.each(this.getPlayers(), player => {
            var deck = undefined;

            if(activePlayer === player.id && player.deck) {
                deck = { name: player.deck.name };
            } else if(player.deck) {
                deck = {};
            }

            playerSummaries.push({ id: player.id, name: player.name, deck: deck, owner: player.owner });
        });

        return {
            id: this.id,
            name: this.name,
            owner: this.owner,
            started: this.started,
            spectators: _.map(this.getSpectators(), spectator => {
                return {
                    id: spectator.id,
                    name: spectator.name
                };
            }),
            players: playerSummaries,
            messages: this.messages
        };
    }

    getOtherPlayer(player) {
        var otherPlayer = _.find(this.getPlayers(), p => {
            return p.id !== player.id;
        });

        return otherPlayer;
    }

    startGameIfAble() {
        if(_.all(this.getPlayers(), player => {
            return player.readyToStart;
        })) {
            _.each(this.getPlayers(), player => {
                player.startGame();

                this.playStarted = true;
            });
        }
    }

    mulligan(playerId) {
        var player = this.getPlayers()[playerId];

        if(this.playStarted || !player) {
            return;
        }

        if(player.mulligan()) {
            this.addMessage(player.name + ' has taken a mulligan');
        }
    }

    keep(playerId) {
        var player = this.getPlayers()[playerId];

        if(!player) {
            return;
        }

        player.keep();

        this.addMessage(player.name + ' has kept their hand');
    }

    playCard(playerId, card, isDrop) {
        var player = this.getPlayers()[playerId];

        if(!player) {
            return;
        }

        this.stopCardPlay = false;
        this.emit('beforeCardPlayed', this, player, card);
        if(this.stopCardPlay) {
            return;
        }

        if(!player.playCard(card, isDrop)) {
            return;
        }

        this.emit('afterCardPlayed', this, player, card);

        var cardImplemation = cards[card.code];
        if(cardImplemation && cardImplemation.register) {
            cardImplemation.register(this, player, card);
        }
    }

    checkForAttachments() {
        var playersWithAttachments = _.filter(this.getPlayers(), p => {
            return p.hasUnmappedAttachments();
        });
        var playersWaiting = _.filter(this.getPlayers(), p => {
            return !p.hasUnmappedAttachments();
        });

        if(playersWithAttachments.length !== 0) {
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
            _.each(this.getPlayers(), p => {
                p.postSetup();
                p.startPlotPhase();
            });
        }
    }

    setupDone(playerId) {
        var player = this.getPlayers()[playerId];

        if(!player) {
            return;
        }

        player.setupDone();

        this.addMessage(player.name + ' has finished setup');

        if(!_.all(this.getPlayers(), p => {
            return p.setup;
        })) {
            player.menuTitle = 'Waiting for opponent to finish setup';
            player.buttons = [];
        } else {
            this.checkForAttachments();
        }
    }

    firstPlayerPrompt(initiativeWinner) {
        initiativeWinner.firstPlayer = true;
        initiativeWinner.menuTitle = 'Select a first player';
        initiativeWinner.buttons = [
            { command: 'firstplayer', text: 'Me', arg: 'me' }
        ];

        if(_.size(this.getPlayers()) > 1) {
            initiativeWinner.buttons.push({ command: 'firstplayer', text: 'Opponent', arg: 'opponent' });
        }

        var otherPlayer = this.getOtherPlayer(initiativeWinner);

        if(otherPlayer) {
            otherPlayer.menuTitle = 'Waiting for opponent to select first player';
            otherPlayer.buttons = [];
        }
    }

    notifyLeavingPlay(player, card) {
        this.emit('cardLeavingPlay', this, player, card);
        var cardImplementation = cards[card.code];
        if(cardImplementation && cardImplementation.unregister) {
            cardImplementation.unregister(this, player, card);
        }
    }

    selectPlot(playerId, plot) {
        var player = this.getPlayers()[playerId];

        if(!player || !player.selectPlot(plot)) {
            return;
        }

        var plotImplementation = cards[player.selectedPlot.card.code];
        if(plotImplementation && plotImplementation.register) {
            plotImplementation.register(this, player);
        }

        this.addMessage(player.name + ' has selected a plot');

        if(!_.all(this.getPlayers(), p => {
            return !!p.selectedPlot;
        })) {
            player.menuTitle = 'Waiting for opponent to select plot';
            player.buttons = [];
        } else {
            var initiativeWinner = undefined;
            var highestInitiative = -1;
            var highestPower = -1;

            // reveal plots when everyone has selected
            _.each(this.getPlayers(), p => {
                p.revealPlot();
                this.emit('plotRevealed', this, p);
            });

            // determine initiative winner
            _.each(this.getPlayers(), p => {
                var playerInitiative = p.getTotalInitiative();
                var playerPower = p.power;

                if(playerInitiative === highestInitiative) {
                    if(playerPower === highestPower) {
                        var diceRoll = _.random(1, 20);
                        if(diceRoll % 2 === 0) {
                            highestInitiative = playerInitiative;
                            highestPower = playerPower;
                            initiativeWinner = p;
                        }
                    }

                    if(playerPower > highestPower) {
                        highestInitiative = playerInitiative;
                        highestPower = playerPower;
                        initiativeWinner = p;
                    }
                }

                if(playerInitiative > highestInitiative) {
                    highestInitiative = playerInitiative;
                    highestPower = playerPower;
                    initiativeWinner = p;
                }
            });

            // initiative winner sets the first player
            // note that control flow for the plot phase after this continues under
            // the setFirstPlayer function
            this.firstPlayerPrompt(initiativeWinner);
        }
    }

    drawPhase(firstPlayer) {
        _.each(this.getPlayers(), p => {
            this.emit('beginDrawPhase', this, p);
            p.drawPhase();
        });

        this.beginMarshal(firstPlayer);
    }

    beginMarshal(player) {
        this.emit('beginMarshal', this, player);

        player.beginMarshal();

        var otherPlayer = this.getOtherPlayer(player);

        if(otherPlayer) {
            otherPlayer.menuTitle = 'Waiting for opponent to marshal their cards';
            otherPlayer.buttons = [];
        }
    }

    playerRevealDone(player) {
        var otherPlayer = this.getOtherPlayer(player);
        var firstPlayer = player.firstPlayer ? player : otherPlayer;

        player.revealFinished = true;

        this.resolvePlotEffects(firstPlayer);
    }

    resolvePlotEffects(firstPlayer) {
        firstPlayer.menuTitle = 'Select player to resolve their plot';
        firstPlayer.buttons = [];

        _.each(this.getPlayers(), p => {
            if(p.hasWhenRevealed() && !p.revealFinished) {
                firstPlayer.buttons.push({ command: 'resolvePlotEffect', text: p.name, arg: p.id });
            }
        });

        if(_.isEmpty(firstPlayer.buttons)) {
            firstPlayer.menuTitle = 'Any reactions or actions?';
            firstPlayer.buttons = [{ command: 'doneWhenRealedEffects', text: 'Done' }];
        }

        var otherPlayer = this.getOtherPlayer(firstPlayer);
        if(otherPlayer) {
            otherPlayer.menuTitle = 'Waiting for first player resolve plot phase';
            otherPlayer.buttons = [];
        }
    }

    resolvePlayerPlotEffect(playerId) {
        var player = this.getPlayers()[playerId];
        var otherPlayer = this.getOtherPlayer(player);
        var firstPlayer = player.firstPlayer ? player : otherPlayer;

        firstPlayer.menuTitle = 'Waiting for opponent to resolve plot effect';
        firstPlayer.buttons = [];

        this.pauseForPlot = false;
        this.emit('whenRevealed', this, player);

        if(!this.pauseForPlot) {
            this.playerRevealDone(player);
        }
    }

    setFirstPlayer(sourcePlayer, who) {
        var firstPlayer = undefined;

        var player = this.getPlayers()[sourcePlayer];

        if(!player) {
            return;
        }

        _.each(this.getPlayers(), player => {
            if(player.id === sourcePlayer && who === 'me') {
                player.firstPlayer = true;
                firstPlayer = player;
            } else if(player.id !== sourcePlayer && who !== 'me') {
                player.firstPlayer = true;
                firstPlayer = player;
            } else {
                player.firstPlayer = false;
            }

            player.menuTitle = '';
            player.buttons = [];
        });

        this.addMessage(player.name + ' has selected ' + firstPlayer.name + ' to be the first player');

        this.resolvePlotEffects(firstPlayer);
    }

    attachCard(player, card) {
        this.canAttach = true;
        this.emit('beforeAttach', this, player, player.selectedAttachment, card);
        if(!this.canAttach) {
            return;
        }

        if(player.dropPending) {
            player.discardPile = _.reject(player.discardPile, c => {
                return c.uuid === player.selectedAttachment.uuid;
            });
        }

        player.removeFromHand(player.selectedAttachment);

        var targetPlayer = this.getPlayers()[card.owner];
        targetPlayer.attach(player.selectedAttachment, card);
        player.selectCard = false;

        if(targetPlayer === player && player.phase === 'setup') {
            // We put attachments on the board during setup, now remove it
            player.cardsInPlay = _.reject(player.cardsInPlay, c => {
                return c.card.uuid === player.selectedAttachment.uuid;
            });
        }

        player.selectedAttachment = undefined;

        if(player.dropPending) {
            player.dropPending = false;

            return;
        }

        if(player.phase === 'setup') {
            this.checkForAttachments();
        } else {
            player.buttons = [{ command: 'donemarshal', text: 'Done' }];
            player.menuTitle = 'Marshal your cards';
        }
    }

    handleChallenge(player, otherPlayer, card) {
        var cardInPlay = player.findCardInPlayByUuid(card.uuid);

        if(!cardInPlay) {
            if(!player.pickingStealth) {
                return false;
            }

            if(otherPlayer) {
                var otherCardInPlay = otherPlayer.findCardInPlayByUuid(card.uuid);

                if(!otherCardInPlay) {
                    return false;
                }

                if(!otherPlayer.addToStealth(otherCardInPlay.card)) {
                    return false;
                }

                this.addMessage(player.name + ' has chosen ' + otherCardInPlay.card.label + ' as a stealth target');
                player.stealthCard.stealthTarget = otherCardInPlay;

                if(this.doStealth(player)) {
                    return true;
                }
            }
        } else {
            if(!player.selectingChallengers || cardInPlay.kneeled) {
                return false;
            }

            var challengeCard = player.canAddToChallenge(card);
            if(!challengeCard) {
                return false;
            }

            this.canAddToChallenge = true;
            this.emit('beforeChallengerSelected', this, player, challengeCard);

            if(this.canAddToChallenge) {
                player.addToChallenge(challengeCard);
            }
        }

        return true;
    }

    handleClaim(player, otherPlayer, card) {
        if(card.type_code !== 'character') {
            return;
        }

        var character = player.killCharacter(card);
        if(character) {
            _.each(character.attachments, attachment => {
                if(this.hasKeyword(attachment, 'Terminal')) {
                    this.getPlayers()[attachment.owner].discardPile.push(attachment);
                } else {
                    this.getPlayers()[attachment.owner].hand.push(attachment);
                }
            });
        }

        if(player.claimToDo === 0) {
            player.doneClaim();

            if(otherPlayer) {
                otherPlayer.beginChallenge();
            }
        }
    }

    processCardClicked(player, card) {
        var otherPlayer = this.getOtherPlayer(player);

        if(!_.isUndefined(player.setPower)) {
            var cardInPlay = player.findCardInPlayByUuid(card.uuid);

            if(!cardInPlay) {
                return false;
            }

            cardInPlay.power = player.setPower;

            this.addMessage(player.name + ' uses the /power command to set the power of ' + cardInPlay.card.label + ' to ' + player.setPower);
            this.doneSetPower(player.id);

            return true;
        }

        this.clickHandled = false;
        this.emit('cardClicked', this, player, card);
        if(this.clickHandled) {
            return true;
        }

        if(player.phase === 'setup' && !player.waitingForAttachments) {
            return false;
        }

        if((player.phase === 'setup' || player.phase === 'marshal' || player.dropPending) && player.selectedAttachment) {
            this.attachCard(player, card);

            return true;
        }

        if(player.phase === 'challenge' && player.currentChallenge) {
            return this.handleChallenge(player, otherPlayer, card);
        }

        if(player.phase === 'claim' && player.currentChallenge === 'military') {
            this.handleClaim(player, otherPlayer, card);

            return true;
        }

        if(player.phase !== 'setup' || card.type_code !== 'attachment') {
            return false;
        }

        player.promptForAttachment(card);

        return true;
    }

    cardClicked(sourcePlayer, card) {
        var player = this.getPlayers()[sourcePlayer];

        if(!player) {
            return;
        }

        if(!this.processCardClicked(player, card)) {
            var cardInPlay = player.findCardInPlayByUuid(card.uuid);

            if(cardInPlay) {
                cardInPlay.kneeled = !cardInPlay.kneeled;
            }
        }
    }

    showDrawDeck(playerId) {
        var player = this.getPlayers()[playerId];

        if(!player) {
            return;
        }

        if(!player.showDeck) {
            player.showDrawDeck();

            this.addMessage(player.name + ' is looking at their deck');
        } else {
            player.showDeck = false;

            this.addMessage(player.name + ' stops looking at their deck');
        }
    }

    drop(playerId, card, source, target) {
        var player = this.getPlayers()[playerId];

        if(!player) {
            return;
        }

        if(player.drop(card, source, target)) {
            this.addMessage(player.name + ' has moved a card from their ' + source + ' to their ' + target);
        }
    }

    marshalDone(playerId) {
        var player = this.getPlayers()[playerId];

        if(!player) {
            return;
        }

        player.marshalDone();

        this.addMessage(player.name + ' has finished marshalling');

        var unMarshalledPlayer = _.find(this.getPlayers(), p => {
            return !p.marshalled;
        });

        if(unMarshalledPlayer) {
            player.menuTitle = 'Waiting for opponent to finish marshalling';
            player.buttons = [];

            this.beginMarshal(unMarshalledPlayer);
        } else {
            var firstPlayer = _.find(this.getPlayers(), p => {
                return p.firstPlayer;
            });

            firstPlayer.beginChallenge();

            var otherPlayer = this.getOtherPlayer(firstPlayer);

            if(otherPlayer) {
                otherPlayer.menuTitle = 'Waiting for opponent to initiate challenge';
                otherPlayer.buttons = [];
            }
        }
    }

    startChallenge(playerId, challengeType) {
        var player = this.getPlayers()[playerId];
        if(!player) {
            return;
        }

        if(player.challenges.complete >= player.challenges.maxTotal) {
            return;
        }

        if(player.challenges[challengeType].performed >= player.challenges[challengeType].max) {
            return;
        }

        player.challengeType = challengeType;

        this.cancelChallenge = false;
        this.emit('beforeChallenge', this, player, challengeType);
        if(this.cancelChallenge) {
            return;
        }

        player.startChallenge(challengeType);
    }

    doStealth(player) {
        var stealthCard = _.find(player.cardsInChallenge, card => {
            return !card.stealthTarget && this.hasKeyword(card.card, 'Stealth');
        });

        if(stealthCard) {
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

        var otherPlayer = this.getOtherPlayer(player);

        if(otherPlayer) {
            player.menuTitle = 'Waiting for opponent to defend';
            player.buttons = [];
            player.selectCard = false;

            otherPlayer.beginDefend(player.currentChallenge);
        }

        return false;
    }

    doneChallenge(playerId) {
        var player = this.getPlayers()[playerId];
        if(!player) {
            return;
        }

        if(!_.any(player.cardsInPlay, card => {
            return card.selected;
        })) {
            player.beginChallenge();
            return;
        }

        var otherPlayer = this.getOtherPlayer(player);

        player.doneChallenge(true);
        if(otherPlayer) {
            otherPlayer.currentChallenge = player.currentChallenge;
        }

        this.doStealth(player);
    }

    doneDefend(playerId) {
        var player = this.getPlayers()[playerId];
        if(!player) {
            return;
        }

        player.doneChallenge(false);

        this.addMessage(player.name + ' has defended with strength ' + player.challengeStrength);

        var challenger = _.find(this.getPlayers(), p => {
            return p.id !== player.id;
        });

        var winner = undefined;
        var loser = undefined;

        if(challenger) {
            if(challenger.challengeStrength >= player.challengeStrength) {
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

            if(loser.challengeStrength === 0) {
                this.addMessage(winner.name + ' has gained 1 power from an unopposed challenge');
                this.addPower(winner, 1);
            }

            // XXX This should be after claim but needs a bit of reworking to make that possible
            this.applyKeywords(winner, loser);

            if(winner === challenger) {
                this.applyClaim(winner, loser);
            } else {
                challenger.beginChallenge();

                player.menuTitle = 'Waiting for opponent to initiate challenge';
                player.buttons = [];
            }
        }
    }

    addPower(player, power) {
        player.power += power;
        this.checkWinCondition(player);
    }

    transferPower(winner, loser, power) {
        var appliedPower = Math.min(loser.power, power);
        loser.power -= appliedPower;
        winner.power += appliedPower;
        this.checkWinCondition(winner);
    }

    checkWinCondition(player) {
        if(player.getTotalPower() >= 15) {
            this.addMessage(player.name + ' has won the game');
        }
    }

    hasKeyword(card, keyword) {
        return card.text && card.text.indexOf(keyword + '.') !== -1;
    }

    applyKeywords(winner, loser) {
        _.each(winner.cardsInChallenge, card => {
            if(this.hasKeyword(card.card, 'Insight')) {
                winner.drawCardsToHand(1);

                this.addMessage(winner.name + ' draws a card from Insight on ' + card.card.label);
            }

            if(this.hasKeyword(card.card, 'Intimidate')) {
                // something
            }

            if(this.hasKeyword(card.card, 'Pillage')) {
                loser.discardFromDraw(1);

                this.addMessage(loser.name + ' discards a card from the top of their deck from Pillage on ' + card.card.label);
            }

            if(this.hasKeyword(card.card, 'Renown')) {
                card.power++;

                this.addMessage(winner.name + ' gains 1 power on ' + card.card.label + ' from Renown');
            }

            this.checkWinCondition(winner);
        });
    }

    applyClaim(winner, loser) {
        this.emit('beforeClaim', this, winner.currentChallenge, winner, loser);
        var claim = winner.activePlot.card.claim;

        if(claim <= 0) {
            this.addMessage('The claim value for ' + winner.currentChallenge + ' is 0, no claim occurs');
        } else {
            if(winner.currentChallenge === 'military') {
                winner.menuTitle = 'Waiting for opponent to apply claim effects';
                winner.buttons = [];

                loser.claimToDo = claim;
                loser.selectCharacterToKill();

                return;
            } else if(winner.currentChallenge === 'intrigue') {
                loser.discardAtRandom(claim);
            } else if(winner.currentChallenge === 'power') {
                this.transferPower(winner, loser, claim);
            }
        }

        this.emit('afterClaim', this, winner.currentChallenge, winner, loser);
        loser.doneClaim();
        winner.beginChallenge();
    }

    doneChallenges(playerId) {
        var challenger = this.getPlayers()[playerId];
        if(!challenger) {
            return;
        }

        challenger.doneChallenges = true;

        var other = _.find(this.getPlayers(), p => {
            return !p.doneChallenges;
        });

        if(other) {
            other.beginChallenge();

            challenger.menuTitle = 'Waiting for opponent to initiate challenge';
            challenger.buttons = [];
        } else {
            this.dominance();
        }
    }

    dominance() {
        var highestDominance = 0;
        var dominanceWinner = undefined;

        _.each(this.getPlayers(), player => {
            player.phase = 'dominance';
            var dominance = player.getDominance();

            if(dominance === highestDominance) {
                dominanceWinner = undefined;
            }

            if(dominance > highestDominance) {
                highestDominance = dominance;
                dominanceWinner = player;
            }
        });

        if(dominanceWinner) {
            this.addMessage(dominanceWinner.name + ' wins dominance');

            this.addPower(dominanceWinner, 1);
        } else {
            this.addMessage('There was a tie for dominance');
            this.addMessage('No one wins dominance');
        }

        this.emit('afterDominance', this, dominanceWinner);

        this.emit('cardsStanding', this);

        _.each(this.getPlayers(), player => {
            player.standCards();
            player.taxation();
        });

        var firstPlayer = _.find(this.getPlayers(), p => {
            return p.firstPlayer;
        });

        firstPlayer.menuTitle = '';
        firstPlayer.buttons = [
            { command: 'doneround', text: 'End Turn' }
        ];

        var otherPlayer = this.getOtherPlayer(firstPlayer);

        if(otherPlayer) {
            otherPlayer.menuTitle = 'Waiting for opponent to end their turn';
            otherPlayer.buttons = [];
        }
    }

    doneRound(playerId) {
        var player = this.getPlayers()[playerId];

        if(!player || player.hand.length > player.reserve) {
            return;
        }

        var otherPlayer = this.getOtherPlayer(player);

        if(!otherPlayer) {
            player.startPlotPhase();

            var plotImplementation = cards[player.activePlot.card.code];
            if(plotImplementation && plotImplementation.unregister) {
                plotImplementation.unregister(this, player);
            }

            return;
        }

        if(otherPlayer && otherPlayer.roundDone) {
            player.startPlotPhase();
            otherPlayer.startPlotPhase();

            plotImplementation = cards[player.activePlot.card.code];
            if(plotImplementation && plotImplementation.unregister) {
                plotImplementation.unregister(this, player);
            }

            plotImplementation = cards[otherPlayer.activePlot.card.code];
            if(plotImplementation && plotImplementation.unregister) {
                plotImplementation.unregister(this, otherPlayer);
            }

            return;
        }

        player.roundDone = true;
        player.menuTitle = 'Waiting for opponent to end their turn';
        player.buttons = [];

        if(otherPlayer) {
            otherPlayer.menuTitle = '';
            otherPlayer.buttons = [
                { command: 'doneround', text: 'End Turn' }
            ];
        }
    }

    changeStat(playerId, stat, value) {
        var player = this.getPlayers()[playerId];
        if(!player) {
            return;
        }

        player[stat] += value;

        if(player[stat] < 0) {
            player[stat] = 0;
        } else {
            this.addMessage(player.name + ' sets ' + stat + ' to ' + player[stat] + ' (' + (value > 0 ? '+' : '') + value + ')');
        }
    }

    customCommand(playerId, arg) {
        var player = this.getPlayers()[playerId];
        if(!player) {
            return;
        }

        this.emit('customCommand', this, player, arg);
    }

    getNumberOrDefault(string, defaultNumber) {
        var num = parseInt(string);

        if(isNaN(num)) {
            num = defaultNumber;
        }

        if(num < 0) {
            num = defaultNumber;
        }

        return num;
    }

    chat(playerId, message) {
        var player = this.players[playerId];
        var args = message.split(' ');
        var num = 1;

        if(!player) {
            return;
        }

        if(this.isSpectator(player)) {
            this.addMessage('<' + player.name + '> ' + message);
            return;
        }

        if(message.indexOf('/draw') !== -1) {
            if(args.length > 1) {
                num = this.getNumberOrDefault(args[1], 1);
            }

            this.addMessage(player.name + ' uses the /draw command to draw ' + num + ' cards to their hand');

            player.drawCardsToHand(num);

            return;
        }

        if(message.indexOf('/power') !== -1) {
            if(args.length > 1) {
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

        if(message.indexOf('/discard') !== -1) {
            if(args.length > 1) {
                num = this.getNumberOrDefault(args[1], 1);
            }

            this.addMessage(player.name + ' uses the /discard command to discard ' + num + ' cards at random');

            player.discardAtRandom(num);

            return;
        }

        if(message.indexOf('/pillage') !== -1) {
            this.addMessage(player.name + ' uses the /pillage command to discard a card from the top of their draw deck');

            player.discardFromDraw(1);

            return;
        }

        this.addMessage('<' + player.name + '> ' + message);
    }

    doneSetPower(playerId) {
        var player = this.getPlayers()[playerId];
        if(!player) {
            return;
        }

        player.menuTitle = player.oldMenuTitle;
        player.buttons = player.oldButtons;
        player.selectCard = false;

        player.oldMenuTitle = undefined;
        player.oldButtons = undefined;
        player.setPower = undefined;
    }

    playerLeave(playerId, reason) {
        var player = this.players[playerId];

        if(!player) {
            return;
        }

        this.addMessage(player.name + ' ' + reason);
    }

    concede(playerId) {
        var player = this.getPlayers()[playerId];

        if(!player) {
            return;
        }

        this.addMessage(player.name + ' concedes');

        var otherPlayer = this.getOtherPlayer(player);

        if(otherPlayer) {
            this.addMessage(otherPlayer.name + ' wins the game');
        }
    }

    selectDeck(playerId, deck) {
        var player = this.getPlayers()[playerId];

        if(!player) {
            return;
        }

        player.selectDeck(deck);
    }

    doneStealth(playerId) {
        var player = this.getPlayers()[playerId];

        if(!player) {
            return;
        }

        var otherPlayer = this.getOtherPlayer(player);

        if(otherPlayer) {
            player.menuTitle = 'Waiting for opponent to defend';
            player.buttons = [];
            player.selectCard = false;

            otherPlayer.beginDefend(player.currentChallenge);
        }

        return false;
    }

    cancelClaim(playerId) {
        var player = this.getPlayers()[playerId];

        if(!player) {
            return;
        }

        this.addMessage(player.name + ' has cancelled claim effects');

        player.doneClaim();

        var otherPlayer = this.getOtherPlayer(player);

        if(otherPlayer) {
            otherPlayer.beginChallenge();
        }
    }

    shuffleDeck(playerId) {
        var player = this.getPlayers()[playerId];
        if(!player) {
            return;
        }

        this.addMessage(player.name + ' shuffles their deck');

        player.shuffleDrawDeck();
    }

    initialise() {
        this.playStarted = false;
        this.messages = [];
        _.each(this.getPlayers(), player => {
            player.initialise();
        });
    }
}

module.exports = Game;
