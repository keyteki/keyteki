const _ = require('underscore');
const EventEmitter = require('events');
const uuid = require('node-uuid');

const cards = require('./cards');
const Player = require('./player.js');
const Spectator = require('./spectator.js');
const BaseCard = require('./basecard.js');

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
        var args = Array.from(arguments).slice(1);
        var formattedMessage = this.formatMessage(message, args);
        this.messages.push({ date: new Date(), message: formattedMessage });
    }

    formatMessage(format, args) {
        var messageFragments = format.split(/(\{\d+\})/);
        return _.map(messageFragments, fragment => {
            var argMatch = fragment.match(/\{(\d+)\}/);
            if(argMatch) {
                var arg = args[argMatch[1]];
                if(!_.isUndefined(arg) && !_.isNull(arg)) {
                    if(arg instanceof BaseCard) {
                        return { code: arg.code, label: arg.name, type: arg.getType() };
                    } else if(arg instanceof Player) {
                        return { name: arg.name };
                    }

                    return arg;
                }

                return '';
            }

            return fragment;
        });
    }

    isSpectator(player) {
        return player.constructor === Spectator;
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

    getPlayerById(playerId) {
        return this.getPlayers()[playerId];
    }

    getPlayersInFirstPlayerOrder() {
        return _.sortBy(this.getPlayers(), 'firstPlayer');
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

    getFirstPlayer() {
        return _.find(this.getPlayers(), p => {
            return p.firstPlayer;
        });
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
        var player = this.getPlayerById(playerId);

        if(this.playStarted || !player) {
            return;
        }

        if(player.mulligan()) {
            this.addMessage('{0} has taken a mulligan', player);
        }
    }

    keep(playerId) {
        var player = this.getPlayerById(playerId);

        if(!player) {
            return;
        }

        player.keep();

        this.addMessage('{0} has kept their hand', player);
    }

    playCard(playerId, cardId, isDrop) {
        var player = this.getPlayerById(playerId);

        if(!player) {
            return;
        }

        if(player.activePlot && !player.activePlot.canPlay(player, cardId)) {
            return;
        }

        var otherPlayer = this.getOtherPlayer(player);
        if(otherPlayer && otherPlayer.activePlot && !otherPlayer.activePlot.canPlay(player, cardId)) {
            return;
        }

        if(!player.playCard(cardId, isDrop)) {
            return;
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
                p.setupDone();
                p.startPlotPhase();
            });
        }
    }

    setupDone(playerId) {
        var player = this.getPlayerById(playerId);

        if(!player) {
            return;
        }

        player.setup = true;

        this.addMessage('{0} has finished setup', player);

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

    selectPlot(playerId, plotId) {
        var player = this.getPlayerById(playerId);

        if(!player || !player.selectPlot(plotId)) {
            return;
        }

        this.addMessage('{0} has selected a plot', player);

        if(!_.all(this.getPlayers(), p => {
            return !!p.selectedPlot;
        })) {
            player.menuTitle = 'Waiting for opponent to select plot';
            player.buttons = [];
        } else {
            var initiativeWinner = undefined;
            var highestInitiative = -1;
            var lowestPower = -1;

            // reveal plots when everyone has selected
            _.each(this.getPlayers(), p => {
                p.revealPlot();
            });

            // determine initiative winner
            _.each(this.getPlayers(), p => {
                var playerInitiative = p.getTotalInitiative();
                var playerPower = p.power;

                if(playerInitiative === highestInitiative) {
                    if(playerPower === lowestPower) {
                        var diceRoll = _.random(1, 20);
                        if(diceRoll % 2 === 0) {
                            highestInitiative = playerInitiative;
                            lowestPower = playerPower;
                            initiativeWinner = p;
                        }
                    }

                    if(playerPower < lowestPower) {
                        highestInitiative = playerInitiative;
                        lowestPower = playerPower;
                        initiativeWinner = p;
                    }
                }

                if(playerInitiative > highestInitiative) {
                    highestInitiative = playerInitiative;
                    lowestPower = playerPower;
                    initiativeWinner = p;
                }
            });

            // initiative winner sets the first player
            // note that control flow for the plot phase after this continues under
            // the setFirstPlayer function
            if(_.size(this.players) === 1) {
                this.setFirstPlayer(player.id, 'me');
            } else {
                this.firstPlayerPrompt(initiativeWinner);
            }
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

        player.revealFinished = true;

        if(otherPlayer) {
            this.resolvePlotEffects(otherPlayer);
        } else {
            player.menuTitle = 'Perform any after reveal actions';
            player.buttons = [{ command: 'doneWhenRealedEffects', text: 'Done' }];
        }
    }

    resolvePlotEffects(firstPlayer) {
        firstPlayer.menuTitle = 'Select player to resolve their plot';
        firstPlayer.buttons = [];

        _.each(this.getPlayers(), p => {
            if(p.activePlot.hasRevealEffect() && !p.revealFinished) {
                firstPlayer.buttons.push({ command: 'resolvePlotEffect', text: p.name, arg: p.id });
            }
        });

        if(firstPlayer.buttons.length === 1) {
            this.resolvePlayerPlotEffect(firstPlayer.buttons[0].arg);

            return;
        }

        if(_.isEmpty(firstPlayer.buttons)) {
            firstPlayer.menuTitle = 'Perform any after reveal actions';
            firstPlayer.buttons = [{ command: 'doneWhenRealedEffects', text: 'Done' }];
        }

        var otherPlayer = this.getOtherPlayer(firstPlayer);
        if(otherPlayer) {
            otherPlayer.menuTitle = 'Waiting for first player to resolve plot phase';
            otherPlayer.buttons = [];
        }
    }

    resolvePlayerPlotEffect(playerId) {
        var player = this.getPlayerById(playerId);
        var otherPlayer = this.getOtherPlayer(player);
        var firstPlayer = player.firstPlayer ? player : otherPlayer;

        if(otherPlayer && otherPlayer.activePlot.hasRevealEffect()) {
            firstPlayer.menuTitle = 'Waiting for opponent to resolve plot effect';
            firstPlayer.buttons = [];
        }

        if(player.activePlot.revealed(player)) {
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

        this.addMessage('{0} has selected {1} to be the first player', player, firstPlayer);

        this.resolvePlotEffects(firstPlayer);
    }

    attachCard(player, cardId) {
        var card = player.findCardInPlayByUuid(cardId);
        var otherPlayer = this.getOtherPlayer(player);

        if(!card) {
            if(!otherPlayer) {
                return;
            }

            card = otherPlayer.findCardInPlayByUuid(cardId);

            if(!card) {
                return;
            }
        }

        if(!player.canAttach(player.selectedAttachment, card)) {
            return;
        }

        if(player.dropPending) {
            player.discardPile = player.removeCardByUuid(player.discardPile, player.selectedAttachment);
        }

        var targetPlayer = this.getPlayers()[card.owner.id];
        if(targetPlayer === player && player.phase === 'setup') {
            // We put attachments on the board during setup, now remove it
            player.attach(player.cardsInPlay, player.selectedAttachment, cardId);
            player.cardsInPlay = player.removeCardByUuid(player.cardsInPlay, player.selectedAttachment);
        } else {
            targetPlayer.attach(player.hand, player.selectedAttachment, cardId);
            player.removeFromHand(player.selectedAttachment);
        }

        player.selectCard = false;

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

    handleChallenge(player, otherPlayer, cardId) {
        var card = player.findCardInPlayByUuid(cardId);

        if(!card) {
            if(!player.pickingStealth) {
                return false;
            }

            if(otherPlayer) {
                var otherCardInPlay = otherPlayer.findCardInPlayByUuid(cardId);

                if(!otherCardInPlay) {
                    return false;
                }

                if(!otherPlayer.addToStealth(otherCardInPlay)) {
                    return false;
                }

                this.addMessage('{0} has chosen {1} as a stealth target', player, otherCardInPlay.card);
                player.stealthCard.stealthTarget = otherCardInPlay;

                if(this.doStealth(player)) {               
                    return true;
                }
            }
        } else {
            if(!player.selectingChallengers || card.kneeled) {
                return false;
            }

            var challengeCard = player.canAddToChallenge(cardId);
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

    handleClaim(player, otherPlayer, cardId) {
        var card = player.findCardInPlayByUuid(cardId);

        if(!card || card.getType() !== 'character') {
            return;
        }

        player.killCharacter(card);

        if(player.claimToDo === 0) {
            player.doneClaim();

            if(otherPlayer) {
                otherPlayer.beginChallenge();
            }
        }
    }

    processCardClicked(player, cardId) {
        var otherPlayer = this.getOtherPlayer(player);
        var card = player.findCardInPlayByUuid(cardId);

        if(player.phase === 'setup' && !player.waitingForAttachments) {
            return false;
        }

        if((player.phase === 'setup' || player.phase === 'marshal' || player.dropPending) && player.selectedAttachment) {
            this.attachCard(player, cardId);

            return true;
        }

        if(player.phase === 'challenge' && player.currentChallenge) {
            return this.handleChallenge(player, otherPlayer, cardId);
        }

        if(player.phase === 'claim' && player.currentChallenge === 'military') {
            this.handleClaim(player, otherPlayer, cardId);

            return true;
        }

        if(card && card.clicked(player)) {
            return true;
        }

        if(player.phase === 'setup') {
            if(card && card.getType() === 'attachment') {
                player.promptForAttachment(card);
                return true;
            }
        }

        return false;
    }

    cardClicked(sourcePlayer, cardId) {
        var player = this.getPlayers()[sourcePlayer];

        if(!player) {
            return;
        }

        var handled = false;

        if(player === this.selectPlayer && this.selectCallback) {
            handled = this.selectCallback(player, cardId);

            if(handled) {
                player.selectCard = false;

                return;
            }
        }

        handled = this.processCardClicked(player, cardId);

        if(!handled) {
            var cardInPlay = player.findCardInPlayByUuid(cardId);

            if(cardInPlay && !cardInPlay.facedown) {
                cardInPlay.kneeled = !cardInPlay.kneeled;
            }
        }
    }

    showDrawDeck(playerId) {
        var player = this.getPlayerById(playerId);

        if(!player) {
            return;
        }

        if(!player.showDeck) {
            player.showDrawDeck();

            this.addMessage('{0} is looking at their deck', player);
        } else {
            player.showDeck = false;

            this.addMessage('{0} stops looking at their deck', player);
        }
    }

    drop(playerId, cardId, source, target) {
        var player = this.getPlayerById(playerId);

        if(!player) {
            return;
        }

        if(player.drop(cardId, source, target)) {
            this.addMessage('{0} has moved a card from their {1} to their {2}', player, source, target);
        }
    }

    marshalDone(playerId) {
        var player = this.getPlayerById(playerId);

        if(!player) {
            return;
        }

        player.marshalDone();

        this.addMessage('{0} has finished marshalling', player);

        var unMarshalledPlayer = _.find(this.getPlayers(), p => {
            return !p.marshalled;
        });

        if(unMarshalledPlayer) {
            player.menuTitle = 'Waiting for opponent to finish marshalling';
            player.buttons = [];

            this.beginMarshal(unMarshalledPlayer);
        } else {
            var firstPlayer = this.getFirstPlayer();

            firstPlayer.beginChallenge();

            var otherPlayer = this.getOtherPlayer(firstPlayer);

            if(otherPlayer) {
                otherPlayer.menuTitle = 'Waiting for opponent to initiate challenge';
                otherPlayer.buttons = [];
            }
        }
    }

    startChallenge(playerId, challengeType) {
        var player = this.getPlayerById(playerId);
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

        if(!player.activePlot.canChallenge(player, challengeType)) {
            return;
        }

        var otherPlayer = this.getOtherPlayer(player);
        if(otherPlayer && !otherPlayer.activePlot.canChallenge(player, challengeType)) {
            return;
        }

        player.startChallenge(challengeType);
    }

    doStealth(player) {
        var stealthCard = player.cardsInChallenge.find(card => {
            return !card.stealthTarget && card.isStealth();
        });

        if(stealthCard) {
            player.menuTitle = 'Select stealth target for ' + stealthCard.name;
            player.buttons = [
                { command: 'donestealth', text: 'Done' }
            ];
            player.stealthCard = stealthCard;
            player.selectCard = true;
            player.pickingStealth = true;

            return true;
        }

        this.addMessage('{0} has initiated a {1} challenge with strength {2}', player, player.currentChallenge, player.challengeStrength);

        var otherPlayer = this.getOtherPlayer(player);

        player.pickingStealth = false;

        if(otherPlayer) {
            player.menuTitle = 'Waiting for opponent to defend';
            player.buttons = [];
            player.selectCard = false;

            otherPlayer.beginDefend(player.currentChallenge);
        }

        return false;
    }

    doneChallenge(playerId) {
        var player = this.getPlayerById(playerId);
        if(!player) {
            return;
        }

        if(!player.areCardsSelected()) {
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
        var player = this.getPlayerById(playerId);
        if(!player) {
            return;
        }

        player.doneChallenge(false);

        this.addMessage('{0} has defended with strength {1}', player, player.challengeStrength);

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

            this.addMessage('{0} won a {1} challenge {2} vs {3}',
                winner, winner.currentChallenge, winner.challengeStrength, loser.challengeStrength);

            this.emit('afterChallenge', winner.currentChallenge, winner, loser);

            if(loser.challengeStrength === 0) {
                this.addMessage('{0} has gained 1 power from an unopposed challenge', winner);
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

        if(player.power < 0) {
            player.power = 0;
        }

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
            this.addMessage('{0} has won the game', player);
        }
    }

    applyKeywords(winner, loser) {
        winner.cardsInChallenge.each(card => {
            if(card.hasKeyword('Insight')) {
                winner.drawCardsToHand(1);

                this.addMessage('{0} draws a card from Insight on {1}', winner, card);
            }

            if(card.hasKeyword('Intimidate')) {
                // something
            }

            if(card.hasKeyword('Pillage')) {
                loser.discardFromDraw(1);

                this.addMessage('{0} discards a card from the top of their deck from Pillage on {1}', loser, card);
            }

            if(card.hasKeyword('Renown')) {
                card.power++;

                this.addMessage('{0} gains 1 power on {1} from Renown', winner, card);
            }

            this.checkWinCondition(winner);
        });
    }

    applyClaim(winner, loser) {
        this.emit('beforeClaim', this, winner.currentChallenge, winner, loser);
        var claim = winner.activePlot.getClaim();
        claim = winner.modifyClaim(winner, winner.currentChallenge, claim);

        if(loser) {
            claim = loser.modifyClaim(winner, winner.currentChallenge, claim);
        }

        if(claim <= 0) {
            this.addMessage('The claim value for {0} is 0, no claim occurs', winner.currentChallenge);
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
        var challenger = this.getPlayerById(playerId);
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
        var lowestDominance = 0;
        var dominanceWinner = undefined;

        _.each(this.getPlayers(), player => {
            player.phase = 'dominance';
            var dominance = player.getDominance();

            lowestDominance = dominance;

            if(dominance === highestDominance) {
                dominanceWinner = undefined;
            }

            if(dominance > highestDominance) {
                lowestDominance = highestDominance;
                highestDominance = dominance;
                dominanceWinner = player;
            } else {
                lowestDominance = dominance;
            }
        });

        if(dominanceWinner) {
            this.addMessage('{0} wins dominance ({1} vs {2})', dominanceWinner, highestDominance, lowestDominance);

            this.addPower(dominanceWinner, 1);
        } else {
            this.addMessage('There was a tie for dominance');
            this.addMessage('No one wins dominance');
        }

        this.emit('afterDominance', dominanceWinner);

        this.emit('cardsStanding', this);

        _.each(this.getPlayers(), player => {
            player.standCards();
            player.taxation();
        });

        var firstPlayer = this.getFirstPlayer();

        firstPlayer.menuTitle = '';
        firstPlayer.buttons = [
            { command: 'doneround', text: 'End Round' }
        ];

        var otherPlayer = this.getOtherPlayer(firstPlayer);

        if(otherPlayer) {
            otherPlayer.menuTitle = 'Waiting for opponent to end the round';
            otherPlayer.buttons = [];
        }
    }

    doneRound(playerId) {
        var player = this.getPlayerById(playerId);

        if(!player || player.hand.size() > player.reserve) {
            return;
        }

        var otherPlayer = this.getOtherPlayer(player);

        if(!otherPlayer) {
            player.startPlotPhase();

            return;
        }

        if(otherPlayer && otherPlayer.roundDone) {
            player.startPlotPhase();
            otherPlayer.startPlotPhase();

            return;
        }

        player.roundDone = true;
        player.menuTitle = 'Waiting for opponent to end the round';
        player.buttons = [];

        if(otherPlayer) {
            otherPlayer.menuTitle = '';
            otherPlayer.buttons = [
                { command: 'doneround', text: 'End Round' }
            ];
        }
    }

    changeStat(playerId, stat, value) {
        var player = this.getPlayerById(playerId);
        if(!player) {
            return;
        }

        player[stat] += value;

        if(player[stat] < 0) {
            player[stat] = 0;
        } else {
            this.addMessage('{0} sets {1} to {2} ({3})', player, stat, player[stat], (value > 0 ? '+' : '') + value);
        }
    }

    customCommand(playerId, arg) {
        var player = this.getPlayerById(playerId);
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
            this.addMessage('<{0}> {1}', player, message);
            return;
        }

        if(message.indexOf('/draw') !== -1) {
            if(args.length > 1) {
                num = this.getNumberOrDefault(args[1], 1);
            }

            this.addMessage('{0} uses the /draw command to draw {1} cards to their hand', player, num);

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

            this.promptForSelect(player, this.setPower.bind(this));

            return;
        }

        if(message.indexOf('/discard') !== -1) {
            if(args.length > 1) {
                num = this.getNumberOrDefault(args[1], 1);
            }

            this.addMessage('{0} uses the /discard command to discard {1} cards at random', player, num);

            player.discardAtRandom(num);

            return;
        }

        if(message.indexOf('/pillage') !== -1) {
            this.addMessage('{0} uses the /pillage command to discard a card from the top of their draw deck', player);

            player.discardFromDraw(1);

            return;
        }

        if(message.indexOf('/strength') !== -1 || message.indexOf('/str') !== -1) {
            if(args.length > 1) {
                num = this.getNumberOrDefault(args[1], 1);
            }

            player.selectCard = true;
            player.oldMenuTitle = player.menuTitle;
            player.oldButtons = player.buttons;
            player.menuTitle = 'Select a card to set strength for';
            player.buttons = [
                { command: 'donesetstrength', text: 'Done' }
            ];
            player.setStrength = num;

            this.promptForSelect(player, this.setStrength.bind(this));

            return;
        }

        this.addMessage('<{0}> {1}', player, message);
    }

    setStrength(player, cardId) {
        var card = player.findCardInPlayByUuid(cardId);

        if(!card || card.getType() !== 'character' || _.isUndefined(player.setStrength)) {
            return false;
        }

        card.strengthModifier = player.setStrength - card.cardData.strength;

        this.addMessage('{0} uses the /strength command to set the strength of {1} to {2}', player, card, player.setStrength);
        this.doneSetStrength(player.id);

        return true;
    }

    setPower(player, cardId) {
        var card = player.findCardInPlayByUuid(cardId);

        if(!card || _.isUndefined(player.setPower)) {
            return false;
        }

        card.power = player.setPower;

        this.addMessage('{0} uses the /power command to set the power of {1} to {2}', player, card, player.setPower);
        this.doneSetPower(player.id);

        return true;
    }

    doneSetPower(playerId) {
        var player = this.getPlayerById(playerId);
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

    doneSetStrength(playerId) {
        var player = this.getPlayerById(playerId);
        if(!player) {
            return;
        }

        player.menuTitle = player.oldMenuTitle;
        player.buttons = player.oldButtons;
        player.selectCard = false;

        player.oldMenuTitle = undefined;
        player.oldButtons = undefined;
        player.setStrength = undefined;
    }

    playerLeave(playerId, reason) {
        var player = this.players[playerId];

        if(!player) {
            return;
        }

        this.addMessage('{0} {1}', player, reason);
    }

    concede(playerId) {
        var player = this.getPlayerById(playerId);

        if(!player) {
            return;
        }

        this.addMessage('{0} concedes', player);

        var otherPlayer = this.getOtherPlayer(player);

        if(otherPlayer) {
            this.addMessage('{0} wins the game', otherPlayer);
        }
    }

    selectDeck(playerId, deck) {
        var player = this.getPlayerById(playerId);

        if(!player) {
            return;
        }

        player.selectDeck(deck);
    }

    doneStealth(playerId) {
        var player = this.getPlayerById(playerId);

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
        var player = this.getPlayerById(playerId);

        if(!player) {
            return;
        }

        this.addMessage('{0} has cancelled claim effects', player);

        player.doneClaim();

        var otherPlayer = this.getOtherPlayer(player);

        if(otherPlayer) {
            otherPlayer.beginChallenge();
        }
    }

    shuffleDeck(playerId) {
        var player = this.getPlayerById(playerId);
        if(!player) {
            return;
        }

        this.addMessage('{0} shuffles their deck', player);

        player.shuffleDrawDeck();
    }

    plotCardCommand(playerId, method, arg) {
        var player = this.getPlayerById(playerId);
        if(!player) {
            return;
        }

        if(player.activePlot && player.activePlot[method]) {
            player.activePlot[method](player, arg);
        }

        var otherPlayer = this.getOtherPlayer(player);
        if(otherPlayer && otherPlayer.activePlot && otherPlayer.activePlot[method]) {
            otherPlayer.activePlot[method](player, arg);
        }
    }

    promptForSelect(player, callback) {
        player.selectCard = true;

        this.selectPlayer = player;
        this.selectCallback = callback;
    }

    initialise() {
        this.playStarted = false;
        this.messages = [];
        _.each(this.getPlayers(), player => {
            player.initialise();
        });
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
}

module.exports = Game;
