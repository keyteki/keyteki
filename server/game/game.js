const _ = require('underscore');
const EventEmitter = require('events');
const moment = require('moment');

const Constants = require('../constants');
const ChatCommands = require('./chatcommands');
const GameChat = require('./gamechat');
const EffectEngine = require('./effectengine');
const Player = require('./player');
const Spectator = require('./spectator');
const AnonymousSpectator = require('./anonymousspectator');
const GamePipeline = require('./gamepipeline');
const SetupPhase = require('./gamesteps/setup/setupphase');
const KeyPhase = require('./gamesteps/key/KeyPhase');
const HousePhase = require('./gamesteps/house/HousePhase');
const MainPhase = require('./gamesteps/main/MainPhase');
const ReadyPhase = require('./gamesteps/ReadyPhase');
const DrawPhase = require('./gamesteps/draw/drawphase');
const SimpleStep = require('./gamesteps/simplestep');
const MenuPrompt = require('./gamesteps/menuprompt');
const HandlerMenuPrompt = require('./gamesteps/handlermenuprompt');
const SelectCardPrompt = require('./gamesteps/selectcardprompt');
const OptionsMenuPrompt = require('./gamesteps/OptionsMenuPrompt');
const GameWonPrompt = require('./gamesteps/GameWonPrompt');
const GameActions = require('./GameActions');
const Event = require('./Events/Event');
const EventWindow = require('./Events/EventWindow');
const AbilityResolver = require('./gamesteps/abilityresolver');
const SimultaneousEffectWindow = require('./gamesteps/SimultaneousEffectWindow');
const AbilityContext = require('./AbilityContext');
const MenuCommands = require('./MenuCommands');
const TimeLimit = require('./TimeLimit');
const PlainTextGameChatFormatter = require('./PlainTextGameChatFormatter');
const CardVisibility = require('./CardVisibility');

class Game extends EventEmitter {
    constructor(details, options = {}) {
        super();

        this.adaptive = { chains: 0, selection: [], biddingWinner: '' };
        this.allowSpectators = details.allowSpectators;
        this.cancelPromptUsed = false;
        this.challonge = details.challonge;
        this.chatCommands = new ChatCommands(this);
        this.createdAt = new Date();
        this.currentAbilityWindow = null;
        this.currentActionWindow = null;
        this.currentEventWindow = null;
        this.currentPhase = '';
        this.effectEngine = new EffectEngine(this);
        this.gameChat = new GameChat();
        this.gameFormat = details.gameFormat;
        this.gamePrivate = details.gamePrivate;
        this.gameTimeLimit = details.gameTimeLimit;
        this.gameType = details.gameType;
        this.hideDecklists = details.hideDecklists;
        this.id = details.id;
        this.manualMode = false;
        this.muteSpectators = details.muteSpectators;
        this.name = details.name;
        this.owner = details.owner.username;
        this.password = details.password;
        this.pipeline = new GamePipeline();
        this.playStarted = false;
        this.playersAndSpectators = {};
        this.previousWinner = details.previousWinner;
        this.savedGameId = details.savedGameId;
        this.showHand = details.showHand;
        this.started = false;
        this.swap = details.swap;
        this.timeLimit = new TimeLimit(this);
        this.useGameTimeLimit = details.useGameTimeLimit;

        this.cardsUsed = [];
        this.cardsPlayed = [];
        this.cardsDiscarded = [];
        this.effectsUsed = [];
        this.activePlayer = null;

        this.cardData = options.cardData || [];

        this.cardVisibility = new CardVisibility(this);

        _.each(details.players, (player) => {
            this.playersAndSpectators[player.user.username] = new Player(
                player.id,
                player.user,
                this.owner === player.user.username,
                this
            );
        });

        _.each(details.spectators, (spectator) => {
            this.playersAndSpectators[spectator.user.username] = new Spectator(
                spectator.id,
                spectator.user
            );
        });

        this.setMaxListeners(0);

        this.router = options.router;
    }

    /*
     * Reports errors from the game engine back to the router
     * @param {type} e
     * @returns {undefined}
     */
    reportError(e) {
        this.router.handleError(this, e);
    }

    /**
     * Adds a message to the in-game chat e.g 'Jadiel draws 1 card'
     * @param {String} message to display (can include {i} references to args)
     * @param {Array} args to match the references in @string
     */
    addMessage() {
        this.gameChat.addMessage(...arguments);
    }

    /**
     * Adds a message to in-game chat with a graphical icon
     * @param {String} one of: 'endofround', 'success', 'info', 'danger', 'warning'
     * @param {String} message to display (can include {i} references to args)
     * @param {Array} args to match the references in @string
     */
    addAlert() {
        this.gameChat.addAlert(...arguments);
    }

    get messages() {
        return this.gameChat.messages;
    }

    getPlainTextLog() {
        let formatter = new PlainTextGameChatFormatter(this.gameChat);
        return formatter.format();
    }

    /**
     * Checks if a player is a spectator
     * @param {Object} player
     * @returns {Boolean}
     */
    isSpectator(player) {
        return player.constructor === Spectator;
    }

    /**
     * Checks whether a player/spectator is still in the game
     * @param {String} playerName
     * @returns {Boolean}
     */
    hasActivePlayer(playerName) {
        return this.playersAndSpectators[playerName] && !this.playersAndSpectators[playerName].left;
    }

    /**
     * Get all players (not spectators) in the game
     * @returns {Player[]}
     */
    getPlayers() {
        return Object.values(this.playersAndSpectators).filter(
            (player) => !this.isSpectator(player)
        );
    }

    /**
     * Returns the Player object (not spectator) for a name
     * @param {String} playerName
     * @returns {Player}
     */
    getPlayerByName(playerName) {
        let player = this.playersAndSpectators[playerName];
        if (player && !this.isSpectator(player)) {
            return player;
        }
    }

    /**
     * Get all players and spectators in the game
     * @returns {Object} {name1: Player, name2: Player, name3: Spectator}
     */
    getPlayersAndSpectators() {
        return this.playersAndSpectators;
    }

    /**
     * Get all spectators in the game
     * @returns {Spectator[]} {name1: Spectator, name2: Spectator}
     */
    getSpectators() {
        return Object.values(this.playersAndSpectators).filter((player) =>
            this.isSpectator(player)
        );
    }

    /**
     * Gets a player other than the one passed (usually their opponent)
     * @param {Player} player
     * @returns {Player}
     */
    getOtherPlayer(player) {
        let otherPlayer = this.getPlayers().find((p) => {
            return p.name !== player.name;
        });

        return otherPlayer;
    }

    /**
     * Returns the visitbility of the card for a given player.
     * @param {Card} card
     * @param {Player} player
     */
    isCardVisible(card, player) {
        return this.cardVisibility.isVisible(card, player);
    }

    /**
     * Returns the card (i.e. character) with matching uuid from either players
     * 'in play' area.
     * @param {String} cardId
     * @returns Card
     */
    findAnyCardInPlayByUuid(cardId) {
        return _.reduce(
            this.getPlayers(),
            (card, player) => {
                if (card) {
                    return card;
                }

                return player.cardsInPlay.find((card) => card.uuid === cardId);
            },
            null
        );
    }

    /**
     * Returns the card with matching uuid from anywhere in the game
     * @param {String} cardId
     * @returns Card
     */
    findAnyCardInAnyList(cardId) {
        return this.allCards.find((card) => card.uuid === cardId);
    }

    /**
     * Returns all cards (i.e. characters) which matching the passed predicated
     * function from either players 'in play' area.
     * @param {Function} predicate - card => Boolean
     * @returns {Array} Array of DrawCard objects
     */
    findAnyCardsInPlay(predicate) {
        let foundCards = [];

        _.each(this.getPlayers(), (player) => {
            foundCards = foundCards.concat(player.cardsInPlay.filter(predicate));
        });

        return foundCards;
    }

    get actions() {
        return GameActions;
    }

    stopClocks() {
        _.each(this.getPlayers(), (player) => player.stopClock());
    }

    /**
     * This function is called from the client whenever a card is clicked
     * @param {String} sourcePlayer - name of the clicking player
     * @param {String} cardId - uuid of the card clicked
     */
    cardClicked(sourcePlayer, cardId) {
        let player = this.getPlayerByName(sourcePlayer);

        if (!player) {
            return;
        }

        let card = this.findAnyCardInAnyList(cardId);

        if (!card) {
            return;
        }

        // Check to see if the current step in the pipeline is waiting for input
        this.pipeline.handleCardClicked(player, card);
    }

    facedownCardClicked(playerName, location, controllerName, isProvince = false) {
        let player = this.getPlayerByName(playerName);
        let controller = this.getPlayerByName(controllerName);
        if (!player || !controller) {
            return;
        }

        let list = controller.getSourceList(location);
        if (!list) {
            return;
        }

        let card = list.find((card) => !isProvince === !card.isProvince);
        if (card) {
            return this.pipeline.handleCardClicked(player, card);
        }
    }

    /**
     * This function is called by the client when a card menu item is clicked
     * @param {String} sourcePlayer - name of clicking player
     * @param {String} cardId - uuid of card whose menu was clicked
     * @param {Object} menuItem - { command: String, text: String, arg: String, method: String }
     */
    menuItemClick(sourcePlayer, cardId, menuItem) {
        let player = this.getPlayerByName(sourcePlayer);
        let card = this.findAnyCardInAnyList(cardId);
        if (!player || !card) {
            return;
        }

        if (menuItem.command === 'click') {
            this.cardClicked(sourcePlayer, cardId);
            return;
        }

        MenuCommands.cardMenuClick(menuItem, this, player, card);
        this.checkGameState(true);
    }

    /**
     * Sets a Player flag and displays a chat message to show that a popup with a
     * player's deck is open
     * @param {String} playerName
     */
    showDeck(playerName) {
        let player = this.getPlayerByName(playerName);

        if (!player) {
            return;
        }

        if (!player.showDeck) {
            player.showDeck = true;

            this.addMessage('{0} is looking at their deck', player);
        } else {
            player.showDeck = false;

            this.addMessage('{0} stops looking at their deck', player);
        }
    }

    /**
     * This function is called from the client whenever a card is dragged from
     * one place to another
     * @param {String} playerName
     * @param {String} cardId - uuid of card
     * @param {String} source - area where the card was dragged from
     * @param {String} target - area where the card was dropped
     */
    drop(playerName, cardId, source, target) {
        let player = this.getPlayerByName(playerName);

        if (!player) {
            return;
        }

        player.drop(cardId, source, target);
    }

    /**
     * Check to see if either player has won/lost the game due to honor (NB: this
     * function doesn't check to see if a conquest victory has been achieved)
     */
    checkWinCondition() {
        for (const player of this.getPlayers()) {
            if (Object.values(player.keys).every((key) => key)) {
                this.recordWinner(player, 'keys');
            }
        }
    }

    /**
     * Display message declaring victory for one player, and record stats for
     * the game
     * @param {Player} winner
     * @param {String} reason
     */
    recordWinner(winner, reason) {
        if (this.winner) {
            return;
        }

        this.addAlert('success', '{0} has won the game', winner);
        this.setWins(winner.name, winner.wins ? winner.wins + 1 : 1);
        this.winner = winner;
        this.finishedAt = new Date();
        this.winReason = reason;

        this.router.gameWon(this, reason, winner);

        this.queueStep(new GameWonPrompt(this, winner));
    }

    /**
     * Changes a Player variable and displays a message in chat
     * @param {String} playerName
     * @param {String} stat
     * @param {Number} value
     */
    changeStat(playerName, stat, value, info) {
        let player = this.getPlayerByName(playerName);
        if (!player) {
            return;
        }

        let target = player;

        target[stat] += value;

        if (target[stat] < 0) {
            target[stat] = 0;
        } else {
            this.addAlert(
                info ? 'info' : 'danger',
                '{0} sets {1} to {2} ({3})',
                player,
                stat,
                target[stat],
                (value > 0 ? '+' : '') + value
            );
        }
    }

    changeActiveHouse(playerName, house) {
        let player = this.getPlayerByName(playerName);
        if (!player) {
            return;
        }

        this.chatCommands.activeHouse(player, ['active-house', house]);
    }

    modifyKey(playerName, color, forged) {
        let player = this.getPlayerByName(playerName);
        if (!player) {
            return;
        }

        if (forged) {
            this.chatCommands.unforge(player, ['modify-key', color]);
        } else {
            this.chatCommands.forge(player, ['modify-key', color]);
        }
    }

    /**
     * This function is called by the client every time a player enters a chat message
     * @param {String} playerName
     * @param {String} message
     */
    chat(playerName, message) {
        let player = this.playersAndSpectators[playerName];
        let args = message.split(' ');

        if (!player) {
            return;
        }

        if (!this.isSpectator(player) && this.manualMode) {
            if (this.chatCommands.executeCommand(player, args[0], args)) {
                this.checkGameState(true);
                return;
            }
        }

        if (!this.isSpectator(player) || !this.muteSpectators) {
            this.gameChat.addChatMessage('{0} {1}', player, message);
        }
    }

    /**
     * This is called by the client when a player clicks 'Concede'
     * @param {String} playerName
     */
    concede(playerName) {
        let player = this.getPlayerByName(playerName);

        if (!player) {
            return;
        }

        this.addAlert('info', '{0} concedes', player);

        let otherPlayer = this.getOtherPlayer(player);

        if (otherPlayer) {
            this.recordWinner(otherPlayer, 'concede');
        }
    }

    selectDeck(playerName, deck) {
        let player = this.getPlayerByName(playerName);
        if (player) {
            player.selectDeck(deck);
        }
    }

    setWins(playerName, wins) {
        let player = this.getPlayerByName(playerName);
        if (player) {
            player.setWins(wins);
        }
    }

    /**
     * Called when a player clicks Shuffle Deck on the conflict deck menu in
     * the client
     * @param {String} playerName
     */
    shuffleDeck(playerName) {
        let player = this.getPlayerByName(playerName);
        if (player) {
            player.shuffleDeck();
        }
    }

    /**
     * Prompts a player with a multiple choice menu
     * @param {Player} player
     * @param {Object} contextObj - the object which contains the methods that are referenced by the menubuttons
     * @param {Object} properties - see menuprompt
     */
    promptWithMenu(player, contextObj, properties) {
        this.queueStep(new MenuPrompt(this, player, contextObj, properties));
    }

    /**
     * Prompts a player with a multiple choice menu
     * @param {Player} player
     * @param {Object} properties - see handlermenuprompt
     */
    promptWithHandlerMenu(player, properties) {
        this.queueStep(new HandlerMenuPrompt(this, this.activePlayer || player, properties));
    }

    /**
     * Prompts a player with a dropdown options menu
     * @param {Player} player
     * @param {Object} properties - see handlermenuprompt
     */
    promptWithOptionsMenu(player, properties) {
        this.queueStep(new OptionsMenuPrompt(this, this.activePlayer || player, properties));
    }

    /**
     * Prompts a player to click a card
     * @param {Player} player
     * @param {Object} properties - see selectcardprompt
     */
    promptForSelect(player, properties) {
        this.queueStep(new SelectCardPrompt(this, this.activePlayer, properties));
    }

    /**
     * This function is called by the client whenever a player clicks a button
     * in a prompt
     * @param {String} playerName
     * @param {String} arg - arg property of the button clicked
     * @param {String} uuid - unique identifier of the prompt clicked
     * @param {String} method - method property of the button clicked
     * @returns {Boolean} this indicates to the server whether the received input is legal or not
     */
    menuButton(playerName, arg, uuid, method) {
        let player = this.getPlayerByName(playerName);
        if (!player) {
            return false;
        }

        // check to see if the current step in the pipeline is waiting for input
        return this.pipeline.handleMenuCommand(player, arg, uuid, method);
    }

    /*
     * This function is called by the client when a player clicks an option setting
     * toggle in the settings menu
     * @param {String} playerName
     * @param {String} settingName - the name of the setting being toggled
     * @param {Boolean} toggle - the new setting of the toggle
     * @returns {undefined}
     */
    toggleOptionSetting(playerName, settingName, toggle) {
        let player = this.getPlayerByName(playerName);
        if (!player) {
            return;
        }

        player.optionSettings[settingName] = toggle;
    }

    toggleManualMode(playerName) {
        let player = this.getPlayerByName(playerName);
        if (!player) {
            return;
        }

        this.chatCommands.manual(player);
    }

    toggleMuteSpectators(playerName) {
        let player = this.getPlayerByName(playerName);
        if (!player) {
            return;
        }

        this.chatCommands.muteSpectators(player);
    }

    /*
     * Sets up Player objects, creates allCards, checks each player has a stronghold
     * and starts the game pipeline
     * @returns {undefined}
     */
    initialise() {
        let players = {};

        _.each(this.playersAndSpectators, (player) => {
            if (!player.left) {
                players[player.name] = player;
            }
        });

        this.playersAndSpectators = players;

        if (this.useGameTimeLimit) {
            let timeLimitStartType = 'whenSetupFinished';
            let timeLimitInMinutes = this.gameTimeLimit;
            this.timeLimit.initialiseTimeLimit(timeLimitStartType, timeLimitInMinutes);
        }

        for (let player of this.getPlayers()) {
            player.initialise();
        }

        this.allCards = _.reduce(
            this.getPlayers(),
            (cards, player) => {
                return cards.concat(player.deck);
            },
            []
        );

        this.pipeline.initialise([
            new SetupPhase(this),
            new SimpleStep(this, () => this.beginRound())
        ]);

        this.playStarted = true;
        this.startedAt = new Date();
        this.round = 1;

        this.continue();
    }

    reInitialisePlayers(swap) {
        let players = this.getPlayers();

        //adaptive swap
        if (swap) {
            const [player1, player2] = Object.keys(players);
            if (player2) {
                const deckData = players[player1].deckData;
                const houses = players[player1].houses;
                players[player1].deckData = players[player2].deckData;
                players[player1].houses = players[player2].houses;
                players[player2].houses = houses;
                players[player2].deckData = deckData;
            }
        }

        this.players = players;

        for (let player of this.getPlayers()) {
            player.initialise();
        }

        this.allCards = _.reduce(
            this.getPlayers(),
            (cards, player) => {
                return cards.concat(player.deck);
            },
            []
        );
    }

    checkForTimeExpired() {
        if (this.timeLimit.isTimeLimitReached && !this.finishedAt) {
            this.addAlert(
                'success',
                'The game has ended because the timer has expired.  Timed wins are not currently implemented'
            );
            this.finishedAt = new Date();
        }
    }

    /*
     * Adds each of the game's main phases to the pipeline
     * @returns {undefined}
     */
    beginRound() {
        this.raiseEvent('onBeginRound');
        this.activePlayer.beginRound();
        this.queueStep(new KeyPhase(this));
        this.queueStep(new HousePhase(this));
        this.queueStep(new MainPhase(this));
        this.queueStep(new ReadyPhase(this));
        this.queueStep(new DrawPhase(this));
        this.queueStep(new SimpleStep(this, () => this.raiseEndRoundEvent()));
        this.queueStep(new SimpleStep(this, () => this.beginRound()));
    }

    /*
     * Adds a step to the pipeline queue
     * @param {BaseStep} step
     * @returns {undefined}
     */
    queueStep(step) {
        this.pipeline.queueStep(step);
        return step;
    }

    /*
     * Creates a step which calls a handler function
     * @param {Function} handler - () => undefined
     * @returns {undefined}
     */
    queueSimpleStep(handler) {
        this.pipeline.queueStep(new SimpleStep(this, handler));
    }

    /*
     * Resolves a card ability or ring effect
     * @param {AbilityContext} context - see AbilityContext
     * @returns {undefined}
     */
    resolveAbility(context) {
        this.raiseEvent('onResolveAbility', { context }, () => {
            this.queueStep(new AbilityResolver(this, context));
        });
    }

    openSimultaneousEffectWindow(choices) {
        let window = new SimultaneousEffectWindow(this);
        _.each(choices, (choice) => window.addChoice(choice));
        this.queueStep(window);
    }

    getEvent(eventName, params, handler) {
        return new Event(eventName, params, handler);
    }

    /**
     * Creates a game Event, and opens a window for it.
     * @param {String} eventName
     * @param {Object} params - parameters for this event
     * @param {Function} handler - (Event + params) => undefined
     * @returns {Event} - this allows the caller to track Event.resolved and
     * tell whether or not the handler resolved successfully
     */
    raiseEvent(eventName, params = {}, handler = () => true) {
        let event = this.getEvent(eventName, params, handler);
        this.openEventWindow([event]);
        return event;
    }

    emitEvent(eventName, params = {}) {
        let event = this.getEvent(eventName, params);
        this.emit(event.name, event);
    }

    /**
     * Creates an EventWindow which will open windows for each kind of triggered
     * ability which can respond any passed events, and execute their handlers.
     * @param events
     * @returns {EventWindow}
     */
    openEventWindow(event) {
        if (_.isArray(event)) {
            if (event.length === 0) {
                return;
            } else if (event.length > 1) {
                for (let e of event.slice(1)) {
                    event[0].addChildEvent(e);
                }
            }

            return this.queueStep(new EventWindow(this, event[0]));
        }

        return this.queueStep(new EventWindow(this, event));
    }

    /**
     * Checks whether a game action can be performed on a card or an array of
     * cards, and performs it on all legal targets.
     * @param {AbilityContext} context
     * @param {Object} actions - Object with { actionName: targets }
     * @returns {Event[]} - TODO: Change this?
     */
    applyGameAction(context, actions) {
        if (!context) {
            context = this.getFrameworkContext();
        }

        let actionPairs = Object.entries(actions);
        let events = actionPairs.reduce((array, [action, cards]) => {
            let gameAction = GameActions[action]();
            gameAction.setTarget(cards);
            return array.concat(gameAction.getEventArray(context));
        }, []);
        if (events.length > 0) {
            this.openEventWindow(events);
        }

        return events;
    }

    getFrameworkContext(player = null) {
        return new AbilityContext({ game: this, player: player });
    }

    checkAlpha() {
        return this.cardsPlayed.length === 0;
    }

    /**
     * Changes the controller of a card in play to the passed player, and cleans
     * all the related stuff up
     * @param {Player} player
     * @param card
     */
    takeControl(player, card) {
        if (card.controller === player || !card.allowGameAction('takeControl')) {
            return;
        }

        this.raiseEvent('onTakeControl', { player, card });
        card.controller.removeCardFromPile(card);
        card.controller = player;
        if (card.type === 'creature' && player.creaturesInPlay.length > 0) {
            let handlers = [
                () => player.cardsInPlay.unshift(card),
                () => player.cardsInPlay.push(card)
            ];
            this.promptWithHandlerMenu(this.activePlayer, {
                activePromptTitle: {
                    text: 'Choose which flank {{card}} should be placed on',
                    values: { card: card.name }
                },
                source: card,
                choices: ['Left', 'Right'],
                handlers: handlers
            });
        } else {
            player.cardsInPlay.push(card);
        }

        card.updateEffectContexts();
        this.queueSimpleStep(() => this.checkGameState(true));
    }

    watch(socketId, user) {
        if (!this.allowSpectators && !user.permissions.canManageGames) {
            return false;
        }

        this.playersAndSpectators[user.username] = new Spectator(socketId, user);
        this.addAlert('info', '{0} has joined the game as a spectator', user.username);

        return true;
    }

    join(socketId, user) {
        if (this.started || this.getPlayers().length === 2) {
            return false;
        }

        this.playersAndSpectators[user.username] = new Player(
            socketId,
            user,
            this.owner === user.username,
            this
        );

        return true;
    }

    isEmpty() {
        return Object.values(this.playersAndSpectators).every((player) => {
            if (player.left || player.id === 'TBA') {
                return true;
            }

            if (!player.disconnectedAt) {
                return false;
            }

            let difference = moment().diff(moment(player.disconnectedAt), 'seconds');

            return difference > 30;
        });
    }

    leave(playerName) {
        let player = this.playersAndSpectators[playerName];

        if (!player) {
            return;
        }

        this.addAlert('info', '{0} has left the game', player);

        if (this.isSpectator(player) || !this.started) {
            delete this.playersAndSpectators[playerName];
        } else {
            player.left = true;

            if (!this.finishedAt) {
                this.finishedAt = new Date();
            }
        }
    }

    disconnect(playerName) {
        let player = this.playersAndSpectators[playerName];

        if (!player) {
            return;
        }

        this.addAlert(
            'info',
            '{0} has disconnected.  The game will wait up to 30 seconds for them to reconnect',
            player
        );

        if (this.isSpectator(player)) {
            delete this.playersAndSpectators[playerName];
        } else {
            player.disconnectedAt = new Date();
        }

        player.socket = undefined;
    }

    rematch() {
        if (!this.finishedAt) {
            this.finishedAt = new Date();
            this.winReason = 'rematch';
        }

        this.router.rematch(this);
    }

    timeExpired() {
        this.emit('onTimeExpired');
    }

    failedConnect(playerName) {
        let player = this.playersAndSpectators[playerName];

        if (!player) {
            return;
        }

        if (this.isSpectator(player) || !this.started) {
            delete this.playersAndSpectators[playerName];
        } else {
            this.addAlert('warning', '{0} has failed to connect to the game', player);

            player.disconnectedAt = new Date();

            if (!this.finishedAt) {
                this.finishedAt = new Date();
            }
        }
    }

    reconnect(socket, playerName) {
        let player = this.getPlayerByName(playerName);
        if (!player) {
            return;
        }

        player.id = socket.id;
        player.socket = socket;
        player.disconnectedAt = undefined;

        this.addAlert('info', '{0} has reconnected', player);
    }

    checkGameState(hasChanged = false) {
        // check for a game state change (recalculating conflict skill if necessary)
        if (this.effectEngine.checkEffects(hasChanged) || hasChanged) {
            this.checkWinCondition();
            // if the state has changed, check for:
            for (const player of this.getPlayers()) {
                _.each(player.cardsInPlay, (card) => {
                    if (card.getModifiedController() !== player) {
                        // any card being controlled by the wrong player
                        this.takeControl(card.getModifiedController(), card);
                    }
                    // any upgrades which are illegally attached
                    // card.checkForIllegalAttachments();
                });
            }

            // destroy any creatures who have damage greater than equal to their power
            let creaturesToDestroy = this.creaturesInPlay.filter(
                (card) =>
                    card.type === 'creature' &&
                    (card.power <= 0 || card.tokens.damage >= card.power) &&
                    !card.moribund
            );
            if (creaturesToDestroy.length > 0) {
                this.actions.destroy().resolve(creaturesToDestroy, this.getFrameworkContext());
            }

            for (let card of this.creaturesInPlay) {
                card.removeToken('armor');
                if (card.armor - card.armorUsed > 0) {
                    card.addToken('armor', card.armor - card.armorUsed);
                }
            }

            // any terminal conditions which have met their condition
            this.effectEngine.checkTerminalConditions();
        }
    }

    checkDelayedEffects(events) {
        if (events.length > 0) {
            // check for any delayed effects which need to fire
            this.effectEngine.checkDelayedEffects(events);
        }
    }

    raiseEndRoundEvent() {
        this.raiseEvent('onRoundEnded', {}, () => {
            this.endRound();
        });
    }

    endRound() {
        if (this.activePlayer.canForgeKey()) {
            this.addAlert('success', '{0} declares Check!', this.activePlayer);
        }

        this.activePlayer.endRound();
        this.cardsUsed = [];
        this.cardsPlayed = [];
        this.cardsDiscarded = [];
        this.effectsUsed = [];

        for (let card of this.cardsInPlay) {
            card.endRound();
        }

        this.activePlayer.activeHouse = null;

        if (this.activePlayer.opponent) {
            this.activePlayer = this.activePlayer.opponent;
        }

        let playerResources = this.getPlayers()
            .map((player) => `${player.name}: ${player.amber} amber (${this.playerKeys(player)})`)
            .join(' ');

        this.addAlert('endofround', `End of turn ${this.round}`);

        if (
            !this.activePlayer.opponent ||
            this.activePlayer.turn === this.activePlayer.opponent.turn
        ) {
            this.round++;
        }

        this.addMessage(playerResources);
        this.addAlert('startofround', `Turn ${this.round}`);
        this.checkForTimeExpired();
    }

    playerKeys(player) {
        const length = Object.values(player.keys).filter((forged) => forged).length;
        return length === 1 ? '1 key' : `${length} keys`;
    }

    get cardsInPlay() {
        return this.getPlayers().reduce((array, player) => array.concat(player.cardsInPlay), []);
    }

    get creaturesInPlay() {
        return this.cardsInPlay.filter((card) => card.type === 'creature');
    }

    /**
     * Return all houses in play.
     *
     * @param {Array} cards - which cards to consider. Default are all cards.
     * @param {boolean} upgrade - if upgrades should be counted. Default is false.
     * @param {filter} filter - an extra filter to apply to the card.
     */
    getHousesInPlay(cards = this.cardsInPlay, upgrade = false, filter = null) {
        return Constants.Houses.filter((house) =>
            cards.some(
                (card) =>
                    ((!filter || filter(card)) && card.hasHouse(house)) ||
                    (upgrade &&
                        card.upgrades &&
                        card.upgrades.some(
                            (upgrade) => (!filter || filter(upgrade)) && upgrade.hasHouse(house)
                        ))
            )
        );
    }

    firstThingThisTurn() {
        return (
            this.cardsDiscarded.length === 0 &&
            this.cardsUsed.length === 0 &&
            this.cardsPlayed.length === 0 &&
            this.effectsUsed.length === 0
        );
    }

    continue() {
        this.pipeline.continue();
    }

    /*
     * This information is all logged when a game is won
     */
    getSaveState() {
        let players = this.getPlayers().map((player) => {
            return {
                deck: player.deckData.identity,
                houses: player.houses,
                keys: player.keys,
                name: player.name,
                turn: player.turn,
                wins: player.wins
            };
        });

        return {
            adaptive: this.adaptive,
            challonge: this.challonge,
            finishedAt: this.finishedAt,
            gameFormat: this.gameFormat,
            gameId: this.id,
            gamePrivate: this.gamePrivate,
            gameType: this.gameType,
            id: this.savedGameId,
            players: players,
            previousWinner: this.previousWinner,
            startedAt: this.startedAt,
            swap: this.swap,
            winReason: this.winReason,
            winner: this.winner ? this.winner.name : undefined
        };
    }

    /*
     * This information is sent to the client
     */
    getState(activePlayerName) {
        let activePlayer = this.playersAndSpectators[activePlayerName] || new AnonymousSpectator();
        let playerState = {};

        if (this.started) {
            for (const player of this.getPlayers()) {
                playerState[player.name] = player.getState(activePlayer, this.gameFormat);
            }

            this.timeLimit.checkForTimeLimitReached();

            return {
                adaptive: this.adaptive,
                cancelPromptUsed: this.cancelPromptUsed,
                challonge: this.challonge,
                gameFormat: this.gameFormat,
                gamePrivate: this.gamePrivate,
                gameTimeLimitStarted: this.timeLimit.timeLimitStarted,
                gameTimeLimitStartedAt: this.timeLimit.timeLimitStartedAt,
                gameTimeLimitTime: this.timeLimit.timeLimitInMinutes,
                hideDecklists: this.hideDecklists,
                id: this.id,
                manualMode: this.manualMode,
                messages: this.gameChat.messages,
                muteSpectators: this.muteSpectators,
                name: this.name,
                owner: this.owner,
                players: playerState,
                previousWinner: this.previousWinner,
                showHand: this.showHand,
                spectators: this.getSpectators().map((spectator) => {
                    return {
                        id: spectator.id,
                        name: spectator.name
                    };
                }),
                started: this.started,
                swap: this.swap,
                useGameTimeLimit: this.useGameTimeLimit,
                winner: this.winner ? this.winner.name : undefined
            };
        }

        return this.getSummary(activePlayerName);
    }

    /*
     * This is used for debugging?
     */
    getSummary(activePlayerName, options = {}) {
        let playerSummaries = {};

        for (const player of this.getPlayers()) {
            let deck = undefined;
            if (player.left) {
                continue;
            }

            if (activePlayerName === player.name && player.deck) {
                deck = { name: player.deck.name, selected: player.deck.selected };
            } else if (player.deck) {
                deck = { selected: player.deck.selected };
            } else {
                deck = {};
            }

            playerSummaries[player.name] = {
                deck: deck,
                emailHash: player.emailHash,
                faction: '',
                id: player.id,
                left: player.left,
                lobbyId: player.lobbyId,
                name: player.name,
                owner: player.owner,
                user: options.fullData && player.user,
                wins: player.wins
            };
        }

        return {
            adaptive: this.adaptive,
            allowSpectators: this.allowSpectators,
            createdAt: this.createdAt,
            challonge: this.challonge,
            gameFormat: this.gameFormat,
            gamePrivate: this.gamePrivate,
            gameType: this.gameType,
            id: this.id,
            manualMode: this.manualMode,
            messages: this.gameChat.messages,
            muteSpectators: this.muteSpectators,
            name: this.name,
            owner: this.owner,
            players: playerSummaries,
            showHand: this.showHand,
            spectators: this.getSpectators().map((spectator) => {
                return {
                    id: spectator.id,
                    lobbyId: spectator.lobbyId,
                    name: spectator.name
                };
            }),
            started: this.started,
            startedAt: this.startedAt,
            swap: this.swap,
            winner: this.winner ? this.winner.name : undefined
        };
    }
}

module.exports = Game;
