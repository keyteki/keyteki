const _ = require('underscore');
const EventEmitter = require('events');
const uuid = require('node-uuid');

const Spectator = require('./spectator.js');
const BaseCard = require('./basecard.js');
const GamePipeline = require('./gamepipeline.js');
const SetupPhase = require('./gamesteps/setupphase.js');
const PlotPhase = require('./gamesteps/plotphase.js');
const DrawPhase = require('./gamesteps/drawphase.js');
const MarshalingPhase = require('./gamesteps/marshalingphase.js');
const DominancePhase = require('./gamesteps/dominancephase.js');
const StandingPhase = require('./gamesteps/standingphase.js');
const TaxationPhase = require('./gamesteps/taxationphase.js');
const FulfillMilitaryClaim = require('./gamesteps/challenge/fulfillmilitaryclaim.js');
const MenuPrompt = require('./gamesteps/menuprompt.js');
const SelectCardPrompt = require('./gamesteps/selectcardprompt.js');

class Game extends EventEmitter {
    constructor(owner, details) {
        super();

        this.players = {};
        this.playerPlots = {};
        this.playerCards = {};
        this.messages = [];

        this.name = details.name;
        this.allowSpectators = details.spectators;
        this.id = uuid.v1();
        this.owner = owner;
        this.started = false;
        this.playStarted = false;

        this.setMaxListeners(0);
    }

    addChatMessage(message) {
        var args = Array.from(arguments).slice(1);
        var formattedMessage = this.formatMessage(message, args);

        this.messages.push({ date: new Date(), message: formattedMessage });
    }

    addMessage(message) {
        var args = Array.from(arguments).slice(1);
        var argList = [];

        args = _.reduce(args, (argList, arg) => {
            if(arg instanceof Spectator) {
                argList.push(arg.name);
            } else {
                argList.push(arg);
            }

            return argList;
        }, argList);

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
                    } else if(arg instanceof Spectator) {
                        return { name: arg.user.username, emailHash: arg.user.emailHash };
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
        return _.sortBy(this.getPlayers(), player => !player.firstPlayer);
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

    findAnyCardInPlayByUuid(cardId) {
        return _.reduce(this.getPlayers(), (card, player) => {
            if(card) {
                return card;
            }
            return player.findCardInPlayByUuid(cardId);
        }, null);
    }

    playCard(playerId, cardId, isDrop, sourceList) {
        var player = this.getPlayerById(playerId);

        if(!player) {
            return;
        }

        var card = player.findCardByUuid(player.hand, cardId);

        if(card && !isDrop && this.pipeline.handleCardClicked(player, card)) {
            this.pipeline.continue();
            return;
        }

        var handled = false;
        if(player === this.selectPlayer && this.selectCallback) {
            handled = this.selectCallback(player, cardId);

            if(handled) {
                if(!this.multiSelect) {
                    player.selectCard = false;
                }

                return;
            }
        }

        if(player.activePlot && !player.activePlot.canPlay(player, cardId)) {
            return;
        }

        var otherPlayer = this.getOtherPlayer(player);
        if(otherPlayer && otherPlayer.activePlot && !otherPlayer.activePlot.canPlay(player, cardId)) {
            return;
        }

        if(!player.playCard(cardId, isDrop, sourceList)) {
            return;
        }

        this.raiseEvent('onCardPlayed', player, cardId);
        this.pipeline.continue();
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

                if(!player.stealthCard.useStealthToBypass(otherCardInPlay)) {
                    return false;
                }

                this.addMessage('{0} has chosen {1} as the stealth target for {2}', player, otherCardInPlay, player.stealthCard);

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
            this.raiseEvent('beforeChallengerSelected', this, player, challengeCard);

            if(this.canAddToChallenge) {
                player.addToChallenge(challengeCard);
            }
        }

        return true;
    }

    processCardClicked(player, cardId) {
        var otherPlayer = this.getOtherPlayer(player);
        var card = this.findAnyCardInPlayByUuid(cardId);

        if(!card) {
            return false;
        }

        if(this.pipeline.handleCardClicked(player, card)) {
            return true;
        }

        if(player.phase === 'challenge' && player.currentChallenge) {
            return this.handleChallenge(player, otherPlayer, cardId);
        }

        if(card && card.onClick(player)) {
            return true;
        }

        return false;
    }

    cardClicked(sourcePlayer, source, cardId) {
        var player = this.getPlayerById(sourcePlayer);

        if(!player) {
            return;
        }

        switch(source) {
            case 'hand':
                this.playCard(player.id, cardId);
                return;
        }

        var handled = false;

        if(player === this.selectPlayer && this.selectCallback) {
            handled = this.selectCallback(player, cardId);

            if(handled) {
                if(!this.multiSelect) {
                    player.selectCard = false;
                }

                return;
            }
        }

        handled = this.processCardClicked(player, cardId);

        if(!handled) {
            var cardInPlay = player.findCardInPlayByUuid(cardId);

            if(cardInPlay && !cardInPlay.facedown) {
                cardInPlay.kneeled = !cardInPlay.kneeled;

                this.addMessage('{0} {1} {2}', player, cardInPlay.kneeled ? 'kneels' : 'stands', cardInPlay);
            }
        }

        this.pipeline.continue();
    }

    discardCardClicked(sourcePlayer, cardId) {
        var player = this.getPlayerById(sourcePlayer);

        if(!player) {
            return;
        }

        var card = _.reduce(this.getPlayers(), (memo, p) => {
            return memo || p.findCardByUuid(p.discardPile, cardId);
        }, null);

        if(!card) {
            return;
        }

        if(this.pipeline.handleCardClicked(player, card)) {
            this.pipeline.continue();
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

    beginChallengePhase() {
        var firstPlayer = this.getFirstPlayer();

        firstPlayer.activePlot.onBeginChallengePhase();

        firstPlayer.phase = 'challenge';

        firstPlayer.beginChallenge();

        var otherPlayer = this.getOtherPlayer(firstPlayer);

        if(otherPlayer) {
            otherPlayer.activePlot.onBeginChallengePhase();
            otherPlayer.phase = 'challenge';
            otherPlayer.menuTitle = 'Waiting for opponent to initiate challenge';
            otherPlayer.buttons = [];
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
            return card.needsStealthTarget();
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

        this.raiseEvent('onChallenge', player, player.currentChallenge);

        player.doneChallenge(true);

        this.raiseEvent('onAttackersDeclared', player, player.currentChallenge);

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

            this.raiseEvent('afterChallenge', winner.currentChallenge, winner, loser, challenger);

            if(loser.challengeStrength === 0) {
                this.addMessage('{0} has gained 1 power from an unopposed challenge', winner);
                this.addPower(winner, 1);

                this.raiseEvent('onUnopposedWin', winner);
            }

            // XXX This should be after claim but needs a bit of reworking to make that possible
            this.applyKeywords(winner, loser);

            if(winner === challenger) {
                this.applyClaim(winner, loser);
            } else {
                this.raiseEvent('onChallengeFinished', winner.currentChallenge, winner, loser, challenger);

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

            if(card.isRenown()) {
                card.power++;

                this.addMessage('{0} gains 1 power on {1} from Renown', winner, card);
            }

            this.checkWinCondition(winner);
        });
    }

    applyClaim(winner, loser) {
        this.raiseEvent('beforeClaim', this, winner.currentChallenge, winner, loser);
        var claim = winner.activePlot.getClaim();
        claim = winner.modifyClaim(winner, winner.currentChallenge, claim);

        if(loser) {
            claim = loser.modifyClaim(winner, winner.currentChallenge, claim);
        }

        if(claim <= 0) {
            this.addMessage('The claim value for {0} is 0, no claim occurs', winner.currentChallenge);
        } else {
            if(winner.currentChallenge === 'military') {
                this.queueStep(new FulfillMilitaryClaim(this, loser, claim));
                this.pipeline.continue();
                return;
            } else if(winner.currentChallenge === 'intrigue') {
                loser.discardAtRandom(claim);
            } else if(winner.currentChallenge === 'power') {
                this.transferPower(winner, loser, claim);
            }
        }

        this.raiseEvent('afterClaim', this, winner.currentChallenge, winner, loser);
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
        this.queueStep(new DominancePhase(this));
        this.queueStep(new StandingPhase(this));
        this.queueStep(new TaxationPhase(this));
        this.pipeline.continue();
    }

    changeStat(playerId, stat, value) {
        var player = this.getPlayerById(playerId);
        if(!player) {
            return;
        }

        player[stat] += value;

        this.raiseEvent('onStatChanged', player, stat, value);

        if(player[stat] < 0) {
            player[stat] = 0;
        } else {
            this.addMessage('{0} sets {1} to {2} ({3})', player, stat, player[stat], (value > 0 ? '+' : '') + value);
        }
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
            this.addChatMessage('{0} {1}', player, message);
            return;
        }

        if(message.indexOf('/draw') === 0) {
            if(args.length > 1) {
                num = this.getNumberOrDefault(args[1], 1);
            }

            this.addMessage('{0} uses the /draw command to draw {1} cards to their hand', player, num);

            player.drawCardsToHand(num);

            return;
        }

        if(message.indexOf('/power') === 0) {
            if(args.length > 1) {
                num = this.getNumberOrDefault(args[1], 1);
            }

            var buttons = [
                { command: 'donesetpower', text: 'Done' }
            ];

            player.setPower = num;

            this.promptForSelectDeprecated(player, this.setPower.bind(this), 'Select a card to set power for', buttons);

            return;
        }

        if(message.indexOf('/discard') === 0) {
            if(args.length > 1) {
                num = this.getNumberOrDefault(args[1], 1);
            }

            this.addMessage('{0} uses the /discard command to discard {1} cards at random', player, num);

            player.discardAtRandom(num);

            return;
        }

        if(message.indexOf('/pillage') === 0) {
            this.addMessage('{0} uses the /pillage command to discard a card from the top of their draw deck', player);

            player.discardFromDraw(1);

            return;
        }

        if(message.indexOf('/strength') === 0 || message.indexOf('/str') === 0) {
            if(args.length > 1) {
                num = this.getNumberOrDefault(args[1], 1);
            }

            buttons = [
                { command: 'donesetstrength', text: 'Done' }
            ];
            player.setStrength = num;

            this.promptForSelectDeprecated(player, this.setStrength.bind(this), 'Select a card to set strength for', buttons);

            return;
        }

        if(message.indexOf('/cancel-prompt') === 0) {
            this.addMessage('{0} uses the /cancel-prompt to skip the current step.', player);
            this.pipeline.cancelStep();
            this.pipeline.continue();
            return;
        }

        this.addChatMessage('{0} {1}', player, message);
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

        this.cancelSelect(player);

        player.setPower = undefined;
    }

    doneSetStrength(playerId) {
        var player = this.getPlayerById(playerId);
        if(!player) {
            return;
        }

        this.cancelSelect(player);

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

    agendaCardCommand(playerId, method, arg) {
        var player = this.getPlayerById(playerId);
        if(!player) {
            return;
        }

        if(player.agenda && player.agenda[method]) {
            player.agenda[method](player, arg);
        }
    }

    promptWithMenu(player, contextObj, properties) {
        this.queueStep(new MenuPrompt(this, player, contextObj, properties));
    }

    promptForSelect(player, properties) {
        this.queueStep(new SelectCardPrompt(this, player, properties));
    }

    /**
     * @deprecated - use promptForSelect or promptWithMenu instead.
     */
    promptForSelectDeprecated(player, callback, menuTitle, buttons, multiSelect) {
        player.selectCard = true;

        this.selectPlayer = player;
        this.selectCallback = callback;

        player.oldMenuTitle = player.menuTitle;
        player.oldButtons = player.buttons;

        player.menuTitle = menuTitle;
        player.buttons = buttons;

        this.multiSelect = multiSelect;
    }

    cancelSelect(player) {
        player.selectCard = false;

        this.selectPlayer = undefined;
        this.selectCallback = undefined;

        player.menuTitle = player.oldMenuTitle;
        player.buttons = player.oldButtons;

    }

    menuButton(playerId, arg, method) {
        var player = this.getPlayerById(playerId);
        if(!player) {
            return;
        }

        if(this.pipeline.handleMenuCommand(player, arg, method)) {
            this.pipeline.continue();
            return true;
        }
    }

    initialise() {
        this.playStarted = false;
        this.messages = [];
        _.each(this.getPlayers(), player => {
            player.initialise();
        });
        this.pipeline = new GamePipeline();
        this.pipeline.initialise([
            new SetupPhase(this)
        ]);
        this.pipeline.continue();
    }

    beginRound() {
        this.queueStep(new PlotPhase(this));
        this.queueStep(new DrawPhase(this));
        this.queueStep(new MarshalingPhase(this));
    }

    queueStep(step) {
        this.pipeline.queueStep(step);
    }

    raiseEvent(eventName, ...params) {
        var event = new Event();

        this.emit(eventName, event, ...params);
        
        return event;
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

            playerSummaries.push({ id: player.id, name: player.user.username, emailHash: player.user.emailHash, deck: deck, owner: player.owner });
        });

        return {
            allowSpectators: this.allowSpectators,
            id: this.id,
            messages: this.messages,
            name: this.name,
            owner: this.owner,
            players: playerSummaries,
            started: this.started,
            spectators: _.map(this.getSpectators(), spectator => {
                return {
                    id: spectator.id,
                    name: spectator.name
                };
            })
        };
    }
}

module.exports = Game;
