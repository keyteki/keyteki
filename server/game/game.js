const _ = require('underscore');
const EventEmitter = require('events');

const ChatCommands = require('./chatcommands.js');
const GameChat = require('./gamechat.js');
const EffectEngine = require('./effectengine.js');
const Effect = require('./effect.js');
const Player = require('./player.js');
const Spectator = require('./spectator.js');
const AnonymousSpectator = require('./anonymousspectator.js');
const GamePipeline = require('./gamepipeline.js');
const SetupPhase = require('./gamesteps/setupphase.js');
const DynastyPhase = require('./gamesteps/dynastyphase.js');
const DrawPhase = require('./gamesteps/drawphase.js');
const ConflictPhase = require('./gamesteps/conflictphase.js');
const FatePhase = require('./gamesteps/fatephase.js');
const RegroupPhase = require('./gamesteps/regroupphase.js');
const SimpleStep = require('./gamesteps/simplestep.js');
const DeckSearchPrompt = require('./gamesteps/decksearchprompt.js');
const HonorBidPrompt = require('./gamesteps/honorbidprompt.js');
const MenuPrompt = require('./gamesteps/menuprompt.js');
const HandlerMenuPrompt = require('./gamesteps/handlermenuprompt.js');
const SelectCardPrompt = require('./gamesteps/selectcardprompt.js');
const SelectRingPrompt = require('./gamesteps/selectringprompt.js');
const EventWindow = require('./gamesteps/eventwindow.js');
const AtomicEventWindow = require('./gamesteps/atomiceventwindow.js');
const SimultaneousEventWindow = require('./gamesteps/simultaneouseventwindow.js');
const CardLeavesPlayEventWindow = require('./gamesteps/cardleavesplayeventwindow.js');
const InitateAbilityEventWindow = require('./gamesteps/initiateabilityeventwindow.js');
const MultipleEventWindow = require('./gamesteps/multipleeventwindow.js');
const AbilityResolver = require('./gamesteps/abilityresolver.js');
const ForcedTriggeredAbilityWindow = require('./gamesteps/forcedtriggeredabilitywindow.js');
const TriggeredAbilityWindow = require('./gamesteps/triggeredabilitywindow.js');
const Ring = require('./ring.js');
const Conflict = require('./conflict.js');
const ConflictFlow = require('./gamesteps/conflict/conflictflow.js');

class Game extends EventEmitter {
    constructor(details, options = {}) {
        super();

        this.effectEngine = new EffectEngine(this);
        this.playersAndSpectators = {};
        this.playerCards = {};
        this.gameChat = new GameChat();
        this.chatCommands = new ChatCommands(this);
        this.pipeline = new GamePipeline();
        this.id = details.id;
        this.name = details.name;
        this.allowSpectators = details.allowSpectators;
        this.owner = details.owner;
        this.started = false;
        this.playStarted = false;
        this.createdAt = new Date();
        this.savedGameId = details.savedGameId;
        this.gameType = details.gameType;
        this.currentActionWindow = null;
        this.currentConflict = null;
        this.manualMode = false;
        this.currentPhase = '';
        this.abilityCardStack = [];
        this.abilityWindowStack = [];
        this.password = details.password;
        this.roundNumber = 0;

        this.militaryConflictCompleted = false;
        this.politicalConflictCompleted = false;
        this.rings = {
            air: new Ring(this, 'air','military'),
            earth: new Ring(this, 'earth','political'),
            fire: new Ring(this, 'fire','military'),
            void: new Ring(this, 'void','political'),
            water: new Ring(this, 'water','military')
        };
        this.shortCardData = options.shortCardData || [];

        _.each(details.players, player => {
            this.playersAndSpectators[player.user.username] = new Player(player.id, player.user, this.owner === player.user.username, this);
        });

        _.each(details.spectators, spectator => {
            this.playersAndSpectators[spectator.user.username] = new Spectator(spectator.id, spectator.user);
        });

        this.setMaxListeners(0);

        this.router = options.router;

        this.pushAbilityContext('framework', null, 'framework');
    }

    reportError(e) {
        this.router.handleError(this, e);
    }

    addMessage() {
        this.gameChat.addMessage(...arguments);
    }
    
    addAlert() {
        this.gameChat.addAlert(...arguments);
    }

    get messages() {
        return this.gameChat.messages;
    }

    isSpectator(player) {
        return player.constructor === Spectator;
    }

    hasActivePlayer(playerName) {
        return this.playersAndSpectators[playerName] && !this.playersAndSpectators[playerName].left;
    }

    getPlayers() {
        return _.omit(this.playersAndSpectators, player => this.isSpectator(player));
    }

    getPlayerByName(playerName) {
        return this.getPlayers()[playerName];
    }

    getPlayersInFirstPlayerOrder() {
        return _.sortBy(this.getPlayers(), player => !player.firstPlayer);
    }

    getPlayersAndSpectators() {
        return this.playersAndSpectators;
    }

    getSpectators() {
        return _.pick(this.playersAndSpectators, player => this.isSpectator(player));
    }

    getFirstPlayer() {
        return _.find(this.getPlayers(), p => {
            return p.firstPlayer;
        });
    }

    getOtherPlayer(player) {
        var otherPlayer = _.find(this.getPlayers(), p => {
            return p.name !== player.name;
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

    findAnyCardInAnyList(cardId) {
        return this.allCards.find(card => card.uuid === cardId);
    }

    findAnyCardsInPlay(predicate) {
        var foundCards = [];

        _.each(this.getPlayers(), player => {
            foundCards = foundCards.concat(player.findCards(player.cardsInPlay, predicate));
        });

        return foundCards;
    }

    addEffect(source, properties) {
        this.effectEngine.add(new Effect(this, source, properties));
    }

    strongholdCardClicked(sourcePlayer) {
        var player = this.getPlayerByName(sourcePlayer);

        if(!player) {
            return;
        }

        if(player.stronghold.bowed) {
            player.readyCard(player.stronghold);
        } else {
            player.bowCard(player.stronghold);
        }

        this.addMessage('{0} {1} their stronghold', player, player.stronghold.bowed ? 'bows' : 'readies');
    }

    selectProvince(player, provinceId) {
        var province = player.findCardByUuid(player.provinceDeck, provinceId);

        if(!province) {
            return;
        }

        player.provinceDeck.each(p => {
            p.selected = false;
        });

        province.selected = true;
    }

    cardClicked(sourcePlayer, cardId) {
        var player = this.getPlayerByName(sourcePlayer);

        if(!player) {
            return;
        }

        var card = this.findAnyCardInAnyList(cardId);

        if(!card) {
            return;
        }

        if(this.pipeline.handleCardClicked(player, card)) {
            return;
        }

        if(card.location === 'province deck') {
            this.selectProvince(player, cardId);
            return;
        }

        if(card.onClick(player)) {
            return;
        }

        //Look for actions or play actions.
        if(player.findAndUseAction(card)) {
            return;
        }

        if(['province 1', 'province 2', 'province 3', 'province 4'].includes(card.location) && card.controller === player && card.isDynasty) {
            if(card.facedown && this.currentPhase === 'dynasty') {
                card.facedown = false;
                this.addMessage('{0} reveals {1}', player, card);
            }
        }        
    }
   
    ringClicked(sourcePlayer, ringindex) {
        var ring = this.rings[ringindex];
        var player = this.getPlayerByName(sourcePlayer);

        if(!player || !ring) {
            return;
        }
        
        if(this.pipeline.handleRingClicked(player, ring)) {
            return;
        }
        
        if(this.currentPhase !== 'conflict' && !ring.claimed) {
            this.flipRing(player, ring);
        }
    }
    
    conflictTopCardClicked(sourcePlayer) {
        let player = this.getPlayerByName(sourcePlayer);

        if(!player || player.conflictDeckTopCardHidden) {
            return;
        }
        
        let card = player.conflictDeck.first();
        
        if(this.pipeline.handleCardClicked(player, card)) {
            return;
        }

        player.findAndUseAction(card);
    }

    returnRings() {
        _.each(this.rings, ring => ring.resetRing());
    }

    cardHasMenuItem(card, menuItem) {
        return card.menu && card.menu.any(m => {
            return m.method === menuItem.method;
        });
    }

    callCardMenuCommand(card, player, menuItem) {
        if(!card || !card[menuItem.method] || !this.cardHasMenuItem(card, menuItem)) {
            return;
        }

        card[menuItem.method](player, menuItem.arg);
    }

    menuItemClick(sourcePlayer, cardId, menuItem) {
        var player = this.getPlayerByName(sourcePlayer);
        if(!player) {
            return;
        }

        if(menuItem.command === 'click') {
            this.cardClicked(sourcePlayer, cardId);
            return;
        }
        var card = this.findAnyCardInAnyList(cardId);
        if(!card) {
            return;
        }

        switch(menuItem.command) {
            case 'bow':
                if(card.bowed) {
                    this.addMessage('{0} readies {1}', player, card);
                    player.readyCard(card);
                } else {
                    this.addMessage('{0} bows {1}', player, card);
                    player.bowCard(card);
                }
                break;
            case 'honor':
                this.addMessage('{0} honors {1}', player, card);
                player.honorCard(card);
                break;
            case 'dishonor':
                this.addMessage('{0} dishonors {1}', player, card);
                player.dishonorCard(card);
                break;
            case 'addfate':
                this.addMessage('{0} adds a fate to {1}', player, card);
                card.modifyFate(1);
                break;
            case 'remfate':
                this.addMessage('{0} removes a fate from {1}', player, card);
                card.modifyFate(-1);
                break;
            case 'move':
                if(this.currentConflict) {
                    if(card.isParticipating()) {
                        this.addMessage('{0} moves {1} out of the conflict', player, card);
                        this.currentConflict.sendHome(card);
                    } else {
                        this.addMessage('{0} moves {1} into the conflict', player, card);
                        this.currentConflict.moveToConflict(card, this.currentConflict.attackingPlayer === player);
                    }
                }
                break;
            case 'control':
                if(player.opponent) {
                    this.addMessage('{0} gives {1} control of {2}', player, player.opponent, card);
                    this.takeControl(player.opponent, card);
                }
                break;
            case 'reveal':
                this.addMessage('{0} reveals {1}', player, card);
                card.facedown = false;
                break;
            case 'hide':
                this.addMessage('{0} flips {1} facedown', player, card);
                card.facedown = true;
                break;
            case 'break':
                this.addMessage('{0} {1} {2}', player, card.isBroken ? 'unbreaks' : 'breaks', card);
                card.isBroken = card.isBroken ? false : true;
                if(card.location === 'stronghold province' && card.isBroken) {
                    this.recordWinner(player.opponent, 'conquest');
                }
                break;
        }
        
        /*
        switch(card.location) {
            case 'province':
                this.callCardMenuCommand(player.activePlot, player, menuItem);
                break;
            case 'play area':
                if(card.controller !== player && !menuItem.anyPlayer) {
                    return;
                }

                this.callCardMenuCommand(card, player, menuItem);
                break;
        }
        */
    }

    ringMenuItemClick(sourcePlayer, sourceRing, menuItem) {
        var player = this.getPlayerByName(sourcePlayer);
        if(!player) {
            return;
        }

        let ringElement = sourceRing.element;
        if(menuItem.command === 'click') {
            this.ringClicked(sourcePlayer, ringElement);
            return;
        }
        var ring = this.rings[ringElement];
        if(!ring) {
            return;
        }
        switch(menuItem.command) {
            case 'flip':
                if(this.currentConflict) {
                    this.addMessage('{0} switches the conflict type', player);
                    this.currentConflict.switchType();
                } else {
                    this.flipRing(player, ring);
                }
                break;
            case 'claim':
                this.addMessage('{0} claims the {1} ring', player, ringElement);
                ring.claimRing(player);
                break;
            case 'unclaimed':
                this.addMessage('{0} sets the {1} ring to unclaimed', player, ringElement);
                ring.resetRing();
                break;
            case 'contested':
                if(this.currentConflict) {
                    if(!ring.claimed) {
                        this.addMessage('{0} switches the conflict to contest the {1} ring', player, ringElement);
                        this.currentConflict.switchElement(ringElement);
                    } else {
                        this.addMessage('{0} tried to switch the conflict to contest the {1} ring, but it\'s already claimed', player, ringElement);
                    }
                }
                break;
            case 'addfate':
                this.addMessage('{0} adds a fate to the {1} ring', player, ringElement);
                ring.modifyFate(1);
                break;
            case 'remfate':
                this.addMessage('{0} removes a fate from the {1} ring', player, ringElement);
                ring.modifyFate(-1);
                break;
            case 'takefate':
                this.addMessage('{0} takes all the fate from the {1} ring and adds it to their pool', player, ringElement);
                this.addFate(player, ring.fate);
                ring.fate = 0;
                break;
            case 'conflict':
                if(this.currentActionWindow && this.currentActionWindow.windowName === 'preConflict') {
                    this.addMessage('{0} initiates a conflict', player);
                    var conflict = new Conflict(this, player, player.opponent, ring.conflictType, ringElement);
                    this.currentConflict = conflict;
                    this.queueStep(new ConflictFlow(this, conflict));
                    this.queueStep(new SimpleStep(this, () => this.currentConflict = null));
                } else {
                    this.addMessage('{0} tried to initiate a conflict, but this can only be done in a pre-conflict action window', player);
                }
                break;
        }
    }

    showConflictDeck(playerName) {
        var player = this.getPlayerByName(playerName);

        if(!player) {
            return;
        }

        if(!player.showConflict) {
            player.showConflictDeck();

            this.addMessage('{0} is looking at their conflict deck', player);
        } else {
            player.showConflict = false;

            this.addMessage('{0} stops looking at their conflict deck', player);
        }
    }

    showDynastyDeck(playerName) {
        var player = this.getPlayerByName(playerName);

        if(!player) {
            return;
        }

        if(!player.showDynasty) {
            player.showDynastyDeck();

            this.addMessage('{0} is looking at their dynasty deck', player);
        } else {
            player.showDynasty = false;

            this.addMessage('{0} stops looking at their dynasty deck', player);
        }
    }

    drop(playerName, cardId, source, target) {
        var player = this.getPlayerByName(playerName);

        if(!player) {
            return;
        }

        if(player.drop(cardId, source, target)) {
            var movedCard = 'a card';
            if(!_.isEmpty(_.intersection(['conflict discard pile', 'dynasty discard pile', 'out of game', 'play area', 'stronghold province', 'province 1', 'province 2', 'province 3', 'province 4'],
                [source, target]))) {
                // log the moved card only if it moved from/to a public place
                var card = this.findAnyCardInAnyList(cardId);
                if(card && !(['dynasty deck', 'province deck'].includes(source) && ['province 1', 'province 2', 'province 3', 'province 4', 'stronghold province'].includes(target))) {
                    movedCard = card;
                }
            }

            this.addMessage('{0} has moved {1} from their {2} to their {3}',
                player, movedCard, source, target);
        }
    }

    addHonor(player, honor) {
        player.honor += honor;

        if(player.honor < 0) {
            player.honor = 0;
        }

        this.checkWinCondition(player);
    }

    addFate(player, fate) {
        player.fate += fate;

        if(player.fate < 0) {
            player.fate = 0;
        }
    }

    transferHonor(source, target, honor) {
        var appliedHonor = Math.min(source.honor, honor);
        source.honor -= appliedHonor;
        target.honor += appliedHonor;

        this.checkWinCondition(target);
        this.checkWinCondition(source);
    }

    transferFate(to, from, fate) {
        var appliedFate = Math.min(from.fate, fate);

        from.fate -= appliedFate;
        to.fate += appliedFate;

        this.raiseEvent('onFateTransferred', { source: from, target: to, amount: fate });
    }

    checkWinCondition(player) {
        if(player.getTotalHonor() >= 25) {
            this.recordWinner(player, 'honor');
        } else if(player.getTotalHonor() === 0) {
            var opponent = this.getOtherPlayer(player);
            this.recordWinner(opponent, 'dishonor');
        }

    }

    recordWinner(winner, reason) {
        if(this.winner) {
            return;
        }

        this.addMessage('{0} has won the game', winner);

        this.winner = winner;
        this.finishedAt = new Date();
        this.winReason = reason;

        this.router.gameWon(this, reason, winner);
    }
    
    setFirstPlayer(firstPlayer) {
        _.each(this.getPlayers(), player => {
            if(player === firstPlayer) {
                player.firstPlayer = true;
            } else {
                player.firstPlayer = false;
            }
        });
    }

    changeStat(playerName, stat, value) {
        var player = this.getPlayerByName(playerName);
        if(!player) {
            return;
        }

        var target = player;

        target[stat] += value;

        if(target[stat] < 0) {
            target[stat] = 0;
        } else {
            this.addMessage('{0} sets {1} to {2} ({3})', player, stat, target[stat], (value > 0 ? '+' : '') + value);
        }
    }

    chat(playerName, message) {
        var player = this.playersAndSpectators[playerName];
        var args = message.split(' ');

        if(!player) {
            return;
        }

        if(!this.isSpectator(player)) {
            if(this.chatCommands.executeCommand(player, args[0], args)) {
                return;
            }

            let card = _.find(this.shortCardData, c => {
                return c.name.toLowerCase() === message.toLowerCase() || c.name.toLowerCase() === message.toLowerCase();
            });

            if(card) {
                this.gameChat.addChatMessage('{0} {1}', player, card);

                return;
            }
        }

        this.gameChat.addChatMessage('{0} {1}', player, message);
    }

    concede(playerName) {
        var player = this.getPlayerByName(playerName);

        if(!player) {
            return;
        }

        this.addMessage('{0} concedes', player);

        var otherPlayer = this.getOtherPlayer(player);

        if(otherPlayer) {
            this.recordWinner(otherPlayer, 'concede');
        }
    }

    selectDeck(playerName, deck) {
        var player = this.getPlayerByName(playerName);

        if(!player) {
            return;
        }

        player.selectDeck(deck);
    }

    shuffleConflictDeck(playerName) {
        var player = this.getPlayerByName(playerName);
        if(!player) {
            return;
        }

        this.addMessage('{0} shuffles their conflict deck', player);

        player.shuffleConflictDeck();
    }

    shuffleDynastyDeck(playerName) {
        var player = this.getPlayerByName(playerName);
        if(!player) {
            return;
        }

        this.addMessage('{0} shuffles their dynasty deck', player);

        player.shuffleDynastyDeck();
    }

    promptWithMenu(player, contextObj, properties) {
        this.queueStep(new MenuPrompt(this, player, contextObj, properties));
    }

    promptWithHandlerMenu(player, properties) {
        this.queueStep(new HandlerMenuPrompt(this, player, properties));
    }

    promptForSelect(player, properties) {
        this.queueStep(new SelectCardPrompt(this, player, properties));
    }

    promptForRingSelect(player, properties) {
        this.queueStep(new SelectRingPrompt(this, player, properties));
    }

    promptForDeckSearch(player, properties) {
        this.raiseEvent('onBeforeDeckSearch', { source: properties.source, player: player }, event => {
            this.queueStep(new DeckSearchPrompt(this, event.player, properties));
        });
    }

    menuButton(playerName, arg, uuid, method) {
        var player = this.getPlayerByName(playerName);
        if(!player) {
            return;
        }

        if(this.pipeline.handleMenuCommand(player, arg, uuid, method)) {
            return true;
        }
    }

    togglePromptedActionWindow(playerName, windowName, toggle) {
        var player = this.getPlayerByName(playerName);
        if(!player) {
            return;
        }

        player.promptedActionWindows[windowName] = toggle;
    }

    toggleTimerSetting(playerName, settingName, toggle) {
        var player = this.getPlayerByName(playerName);
        if(!player) {
            return;
        }

        player.timerSettings[settingName] = toggle;
    }

    toggleOptionSetting(playerName, settingName, toggle) {
        var player = this.getPlayerByName(playerName);
        if(!player) {
            return;
        }

        player.optionSettings[settingName] = toggle;
    }

    initialise() {
        var players = {};

        _.each(this.playersAndSpectators, player => {
            if(!player.left) {
                players[player.name] = player;
            }
        });

        this.playersAndSpectators = players;

        _.each(this.getPlayers(), player => {
            player.initialise();
        });

        this.allCards = _(_.reduce(this.getPlayers(), (cards, player) => {
            return cards.concat(player.preparedDeck.allCards);
        }, []));

        this.pipeline.initialise([
            new SetupPhase(this),
            new SimpleStep(this, () => this.beginRound())
        ]);

        this.playStarted = true;
        this.startedAt = new Date();

        this.continue();
    }

    beginRound() {
        this.raiseEvent('onBeginRound');
        this.queueStep(new DynastyPhase(this));
        this.queueStep(new DrawPhase(this));
        this.queueStep(new ConflictPhase(this));
        this.queueStep(new FatePhase(this));
        this.queueStep(new RegroupPhase(this));
        this.queueStep(new SimpleStep(this, () => this.beginRound()));
    }

    queueStep(step) {
        this.pipeline.queueStep(step);
    }

    queueSimpleStep(handler) {
        this.pipeline.queueStep(new SimpleStep(this, handler));
    }

    markActionAsTaken() {
        if(this.currentActionWindow) {
            this.currentActionWindow.markActionAsTaken();
        }
    }

    getCurrentAbilityContext() {
        return _.last(this.abilityCardStack);
    }

    pushAbilityContext(source, card, stage) {
        this.abilityCardStack.push({ source: source, card: card, stage: stage });
    }

    popAbilityContext() {
        this.abilityCardStack.pop();
    }

    resolveAbility(context) {
        this.queueStep(new AbilityResolver(this, context));
    }

    openAbilityWindow(properties) {
        let windowClass = ['forcedreaction', 'forcedinterrupt', 'whenrevealed'].includes(properties.abilityType) ? ForcedTriggeredAbilityWindow : TriggeredAbilityWindow;
        let window = new windowClass(this, { abilityType: properties.abilityType, event: properties.event });
        this.abilityWindowStack.push(window);
        window.emitEvents();
        this.queueStep(window);
        this.queueSimpleStep(() => this.abilityWindowStack.pop());
    }

    registerAbility(ability, event) {
        let windowIndex = _.findLastIndex(this.abilityWindowStack, window => window.canTriggerAbility(ability));

        if(windowIndex === -1) {
            return;
        }

        let window = this.abilityWindowStack[windowIndex];
        if(event) {
            window.registerAbility(ability, event);
        } else {
            window.registerAbilityForEachEvent(ability);
        }
    }

    raiseEvent(eventName, params, handler = () => true) {
        this.queueStep(new EventWindow(this, eventName, params || {}, handler));
    }

    /**
     * Raises multiple events whose resolution is performed atomically. Any
     * abilities triggered by these events will appear within the same prompt
     * for the player.
     */
    raiseAtomicEvent(events, handler = () => true) {
        this.queueStep(new AtomicEventWindow(this, events, handler));
    }

    /**
     * Raises the same event across multiple cards as well as a wrapping plural
     * version of the event that lists all cards.
     */
    raiseSimultaneousEvent(cards, properties) {
        this.queueStep(new SimultaneousEventWindow(this, cards, properties));
    }

    raiseCardLeavesPlayEvent(card, destination, isSacrifice = false) {
        this.queueStep(new CardLeavesPlayEventWindow(this, card, destination, isSacrifice));
    }

    raiseInitiateAbilityEvent(properties) {
        this.queueStep(new InitateAbilityEventWindow(this, properties));
    }

    /**
     * Raises multiple events whose resolution is performed atomically. Any
     * abilities triggered by these events will appear within the same prompt
     * for the player. Allows each event to take its own handler which will
     * all execute in the same step
     */
    raiseMultipleEvents(events) {
        this.queueStep(new MultipleEventWindow(this, events));
    }

    flipRing(player, ring) {
        ring.flipConflictType();
    }

    placeFateOnUnclaimedRings() {
        _.each(this.rings, ring => {
            if(!ring.claimed) {
                ring.modifyFate(1);
            }
        });
    }

    tradeHonorAfterBid() {
        var honorDifference = 0;
        var remainingPlayers = this.getPlayersInFirstPlayerOrder();
        let currentPlayer = remainingPlayers.shift();
        if(remainingPlayers.length > 0) {

            var otherPlayer = remainingPlayers.shift();
            if(currentPlayer.honorBid > otherPlayer.honorBid) {
                honorDifference = currentPlayer.honorBid - otherPlayer.honorBid;
                this.transferHonor(currentPlayer, otherPlayer, honorDifference);
                this.addMessage('{0} gives {1} {2} honor', currentPlayer, otherPlayer, honorDifference);
            } else if(otherPlayer.honorBid > currentPlayer.honorBid) {
                honorDifference = otherPlayer.honorBid - currentPlayer.honorBid;
                this.transferHonor(otherPlayer, currentPlayer, honorDifference);
                this.addMessage('{0} gives {1} {2} honor', otherPlayer, currentPlayer, honorDifference);
            }
        }
    }
    
    takeControl(player, card) {
        if(card.controller === player || !card.allowGameAction('takeControl')) {
            return;
        }

        if(card.location !== 'play area') {
            player.putIntoPlay(card);
            return;
        }

        card.controller.removeCardFromPile(card);
        player.cardsInPlay.push(card);
        card.controller = player;
        card.checkForIllegalAttachments();
        if(card.isDefending()) {
            this.currentConflict.defenders = _.reject(this.currentConflict.defenders, c => c === card);
            if(card.canParticipateAsAttacker(this.currentConflict.conflictType)) {
                this.currentConflict.attackers.push(card);
            } else {
                this.addMessage('{0} cannot participate in the conflict any more and is sent home bowed', card);
                card.inConflict = false;
                player.bowCard(card);
            }
            card.applyPersistentEffects();
            this.currentConflict.calculateSkill();
        } else if(card.isAttacking()) {
            this.currentConflict.attackers = _.reject(this.currentConflict.attackers, c => c === card);
            if(card.canParticipateAsDefender(this.currentConflict.conflictType)) {
                this.currentConflict.defenders.push(card);
            } else {
                this.addMessage('{0} cannot participate in the conflict any more and is sent home bowed', card);
                card.inConflict = false;
                player.bowCard(card);
            }
            card.applyPersistentEffects();
            this.currentConflict.calculateSkill();
        } else {
            card.applyPersistentEffects();
        }
        this.raiseEvent('onCardTakenControl', { card: card });
    }
    
    initiateDuel(source, target, resolutionHandler, costHandler = () => this.tradeHonorAfterBid()) {
        this.queueStep(new HonorBidPrompt(this, 'Choose your bid for the duel'));
        this.queueStep(new SimpleStep(this, costHandler));                
        this.queueStep(new SimpleStep(this, () => {
            let myTotal = parseInt(source.getMilitarySkill()) + parseInt(source.controller.honorBid);
            let oppTotal = parseInt(target.getMilitarySkill()) + parseInt(target.controller.honorBid);
            let winner = source;
            let loser = target;
            if(myTotal === oppTotal) {
                this.addMessage('The duel ends in a draw');
                return;
            } else if(myTotal < oppTotal) {
                winner = target;
                loser = source;
            }
            this.addMessage('{0}: {1} vs {2}: {3}', source, myTotal, oppTotal, target);
            resolutionHandler(winner, loser);
        }));
    }

    applyGameAction(actionType, cards, func) {
        let wasArray = _.isArray(cards);
        if(!wasArray) {
            cards = [cards];
        }
        let [allowed, disallowed] = _.partition(cards, card => card.allowGameAction(actionType));

        if(!_.isEmpty(disallowed)) {
            // TODO: add a cannot / immunity message.
        }

        if(_.isEmpty(allowed)) {
            return;
        }

        if(wasArray) {
            func(allowed);
        } else {
            func(allowed[0]);
        }
    }

    watch(socketId, user) {
        if(!this.allowSpectators) {
            return false;
        }

        this.playersAndSpectators[user.username] = new Spectator(socketId, user);
        this.addMessage('{0} has joined the game as a spectator', user.username);

        return true;
    }

    join(socketId, user) {
        if(this.started || _.values(this.getPlayers()).length === 2) {
            return false;
        }

        this.playersAndSpectators[user.username] = new Player(socketId, user, this.owner === user.username, this);

        return true;
    }

    isEmpty() {
        return _.all(this.playersAndSpectators, player => player.disconnected || player.left || player.id === 'TBA');
    }

    leave(playerName) {
        var player = this.playersAndSpectators[playerName];

        if(!player) {
            return;
        }

        this.addMessage('{0} has left the game', player);

        if(this.isSpectator(player) || !this.started) {
            delete this.playersAndSpectators[playerName];
        } else {
            player.left = true;

            if(!this.finishedAt) {
                this.finishedAt = new Date();
            }
        }
    }

    disconnect(playerName) {
        var player = this.playersAndSpectators[playerName];

        if(!player) {
            return;
        }

        this.addMessage('{0} has disconnected', player);

        if(this.isSpectator(player)) {
            delete this.playersAndSpectators[playerName];
        } else {
            player.disconnected = true;
        }

        player.socket = undefined;
    }

    failedConnect(playerName) {
        var player = this.playersAndSpectators[playerName];

        if(!player) {
            return;
        }

        if(this.isSpectator(player) || !this.started) {
            delete this.playersAndSpectators[playerName];
        } else {
            this.addMessage('{0} has failed to connect to the game', player);

            player.disconnected = true;

            if(!this.finishedAt) {
                this.finishedAt = new Date();
            }
        }
    }

    reconnect(socket, playerName) {
        var player = this.getPlayerByName(playerName);
        if(!player) {
            return;
        }

        player.id = socket.id;
        player.socket = socket;
        player.disconnected = false;

        this.addMessage('{0} has reconnected', player);
    }

    reapplyStateDependentEffects() {
        this.effectEngine.reapplyStateDependentEffects();
    }

    continue() {
        this.effectEngine.reapplyStateDependentEffects();
        this.pipeline.continue();
        this.effectEngine.reapplyStateDependentEffects();
        // Ensure any events generated by the effects engine are resolved.
        this.pipeline.continue();
    }

    getSaveState() {
        var players = _.map(this.getPlayers(), player => {
            return {
                name: player.name,
                faction: player.faction.name || player.faction.value,
                alliance: player.alliance ? player.alliance.name : undefined,
                honor: player.getTotalHonor()
            };
        });

        return {
            id: this.savedGameId,
            gameId: this.id,
            startedAt: this.startedAt,
            players: players,
            winner: this.winner ? this.winner.name : undefined,
            winReason: this.winReason,
            finishedAt: this.finishedAt
        };
    }

    getState(activePlayerName) {
        let activePlayer = this.playersAndSpectators[activePlayerName] || new AnonymousSpectator();
        let playerState = {};
        let ringState = {};

        if(this.started) {
            _.each(this.getPlayers(), player => {
                playerState[player.name] = player.getState(activePlayer);
            });

            _.each(this.rings, ring => {
                ringState[ring.element] = ring.getState();
            });

            return {
                id: this.id,
                manualMode: this.manualMode,
                name: this.name,
                owner: this.owner,
                players: playerState,
                rings: ringState,
                messages: this.gameChat.messages,
                spectators: _.map(this.getSpectators(), spectator => {
                    return {
                        id: spectator.id,
                        name: spectator.name
                    };
                }),
                started: this.started,
                winner: this.winner ? this.winner.name : undefined,
                cancelPromptUsed: this.cancelPromptUsed
            };
        }

        return this.getSummary(activePlayerName);
    }

    getSummary(activePlayerName) {
        var playerSummaries = {};

        _.each(this.getPlayers(), player => {
            var deck = undefined;
            if(player.left) {
                return;
            }

            if(activePlayerName === player.name && player.deck) {
                deck = { name: player.deck.name, selected: player.deck.selected };
            } else if(player.deck) {
                deck = { selected: player.deck.selected };
            } else {
                deck = {};
            }

            playerSummaries[player.name] = {
                deck: deck,
                emailHash: player.emailHash,
                faction: player.faction.value,
                id: player.id,
                lobbyId: player.lobbyId,
                left: player.left,
                name: player.name,
                owner: player.owner
            };
        });

        return {
            allowSpectators: this.allowSpectators,
            createdAt: this.createdAt,
            gameType: this.gameType,
            id: this.id,
            manualMode: this.manualMode,
            messages: this.gameChat.messages,
            name: this.name,
            owner: this.owner,
            players: playerSummaries,
            rings: {
                air: this.rings.air.getState(),
                earth: this.rings.earth.getState(),
                fire: this.rings.fire.getState(),
                void: this.rings.void.getState(),
                water: this.rings.water.getState()
            },
            started: this.started,
            startedAt: this.startedAt,
            spectators: _.map(this.getSpectators(), spectator => {
                return {
                    id: spectator.id,
                    lobbyId: spectator.lobbyId,
                    name: spectator.name
                };
            })
        };
    }
}

module.exports = Game;
