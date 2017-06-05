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
const MenuPrompt = require('./gamesteps/menuprompt.js');
const SelectCardPrompt = require('./gamesteps/selectcardprompt.js');
const EventWindow = require('./gamesteps/eventwindow.js');
const SimultaneousEventWindow = require('./gamesteps/simultaneouseventwindow.js');
const AbilityResolver = require('./gamesteps/abilityresolver.js');
const ForcedTriggeredAbilityWindow = require('./gamesteps/forcedtriggeredabilitywindow.js');
const TriggeredAbilityWindow = require('./gamesteps/triggeredabilitywindow.js');
const KillCharacters = require('./gamesteps/killcharacters.js');

class Game extends EventEmitter {
    constructor(details, options = {}) {
        super();

        this.effectEngine = new EffectEngine(this);
        this.playersAndSpectators = {};
        this.playerPlots = {};
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
        this.abilityCardStack = [];
        this.abilityWindowStack = [];
        this.password = details.password;

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

    addMessage() {
        this.gameChat.addMessage(...arguments);
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
        return _.reduce(this.getPlayers(), (card, player) => {
            if(card) {
                return card;
            }
            return player.findCardByUuidInAnyList(cardId);
        }, null);
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

        // Attempt to play cards that are not already in the play area.
        if(['hand', 'conflict discard pile', 'dynasty discard pile'].includes(card.location) && player.playCard(card)) {
            return;
        }

        if(card.onClick(player)) {
            return;
        }

        if(!card.facedown && card.location === 'play area' && card.controller === player) {
            if(card.bowed) {
                player.readyCard(card);
            } else {
                player.bowCard(card);
            }

            this.addMessage('{0} {1} {2}', player, card.bowed ? 'bows' : 'readies', card);
        }
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
    }

    showConflictDeck(playerName) {
        var player = this.getPlayerByName(playerName);

        if(!player) {
            return;
        }

        if(!player.showConflictDeck) {
            player.showConflictDeck();

            this.addMessage('{0} is looking at their conflict deck', player);
        } else {
            player.showConflictDeck = false;

            this.addMessage('{0} stops looking at their conflict deck', player);
        }
    }

    showDynastyDeck(playerName) {
        var player = this.getPlayerByName(playerName);

        if(!player) {
            return;
        }

        if(!player.showDynastyDeck) {
            player.showDynastyDeck();

            this.addMessage('{0} is looking at their dynasty deck', player);
        } else {
            player.showDeck = false;

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
                if(card && this.currentPhase !== 'setup') {
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

        this.raiseEvent('onStatChanged', player, 'honor');

        this.checkWinCondition(player);
    }

    addFate(player, fate) {
        player.fate += fate;

        if(player.fate < 0) {
            player.fate = 0;
        }

        this.raiseEvent('onStatChanged', player, 'fate');
    }

    transferHonor(winner, loser, honor) {
        var appliedHonor = Math.min(loser.honor, honor);
        loser.honor -= appliedHonor;
        winner.honor += appliedHonor;

        this.raiseEvent('onStatChanged', loser, 'honor');
        this.raiseEvent('onStatChanged', winner, 'honor');

        this.checkWinCondition(winner);
    }

    transferFate(to, from, fate) {
        var appliedFate = Math.min(from.fate, fate);

        from.fate -= appliedFate;
        to.fate += appliedFate;

        this.raiseEvent('onStatChanged', from, 'fate');
        this.raiseEvent('onStatChanged', to, 'fate');

        this.raiseMergedEvent('onFateTransferred', { source: from, target: to, amount: fate });
    }

    checkWinCondition(player) {
        if(player.getTotalHonor() >= 25) {
            this.recordWinner(player, 'honor');
        } else if(player .getTotalHonor() == 0) {
            var opponent = this.getOtherPlayer(player);
            this.recordWinner(opponent, 'dishonor');
        }
        
    }

    playerDecked(player) {
        var otherPlayer = this.getOtherPlayer(player);

        if(otherPlayer) {
            this.addMessage('{0}\'s draw deck is empty', player);

            this.recordWinner(otherPlayer, 'decked');
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

    changeStat(playerName, stat, value) {
        var player = this.getPlayerByName(playerName);
        if(!player) {
            return;
        }

        var target = player;

        if(stat === 'power') {
            target = player.faction;
        } else if(stat === 'reserve' || stat === 'claim') {
            if(!player.activePlot) {
                return;
            }

            target = player.activePlot.cardData;
        }

        target[stat] += value;

        this.raiseEvent('onStatChanged', player, stat, value);

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

    shuffleDeck(playerName) {
        var player = this.getPlayerByName(playerName);
        if(!player) {
            return;
        }

        this.addMessage('{0} shuffles their deck', player);

        player.shuffleDrawDeck();
    }

    promptWithMenu(player, contextObj, properties) {
        this.queueStep(new MenuPrompt(this, player, contextObj, properties));
    }

    promptForSelect(player, properties) {
        this.queueStep(new SelectCardPrompt(this, player, properties));
    }

    promptForDeckSearch(player, properties) {
        this.raiseMergedEvent('onBeforeDeckSearch', { source: properties.source, player: player }, event => {
            this.queueStep(new DeckSearchPrompt(this, event.player, properties));
        });
    }

    menuButton(playerName, arg, method) {
        var player = this.getPlayerByName(playerName);
        if(!player) {
            return;
        }

        if(this.pipeline.handleMenuCommand(player, arg, method)) {
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
            return cards.concat(player.allCards.toArray());
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

    get currentAbilityContext() {
        return _.last(this.abilityCardStack);
    }

    pushAbilityContext(source, card, stage) {
        this.abilityCardStack.push({ source: source, card: card, stage: stage });
    }

    popAbilityContext() {
        this.abilityCardStack.pop();
    }

    resolveAbility(ability, context) {
        this.queueStep(new AbilityResolver(this, ability, context));
    }

    openAbilityWindow(properties) {
        let windowClass = ['forcedreaction', 'forcedinterrupt', 'whenrevealed'].includes(properties.abilityType) ? ForcedTriggeredAbilityWindow : TriggeredAbilityWindow;
        let window = new windowClass(this, { abilityType: properties.abilityType, event: properties.event });
        this.abilityWindowStack.push(window);
        this.emit(properties.event.name + ':' + properties.abilityType, ...properties.event.params);
        this.queueStep(window);
        this.queueSimpleStep(() => this.abilityWindowStack.pop());
    }

    registerAbility(ability, context) {
        var currentReaction = _.last(this.abilityWindowStack);

        if(!currentReaction) {
            return false;
        }

        currentReaction.registerAbility(ability, context);
    }

    raiseEvent(eventName, ...params) {
        var handler = () => true;

        if(_.isFunction(_.last(params))) {
            handler = params.pop();
        }

        this.queueStep(new EventWindow(this, eventName, params, handler));
    }

    raiseMergedEvent(eventName, params, handler) {
        if(!handler) {
            handler = () => true;
        }

        this.queueStep(new EventWindow(this, eventName, params, handler, true));
    }

    raiseSimultaneousEvent(cards, properties) {
        this.queueStep(new SimultaneousEventWindow(this, cards, properties));
    }

    killCharacters(cards, allowSave = true) {
        this.queueStep(new KillCharacters(this, cards, allowSave));
    }

    killCharacter(card, allowSave = true) {
        this.killCharacters([card], allowSave);
    }

    takeControl(player, card) {
        var oldController = card.controller;
        var newController = player;

        if(oldController === newController) {
            return;
        }

        this.applyGameAction('takeControl', card, card => {
            oldController.removeCardFromPile(card);
            oldController.allCards = _(oldController.allCards.reject(c => c === card));
            newController.cardsInPlay.push(card);
            newController.allCards.push(card);
            card.controller = newController;

            if(card.location !== 'play area') {
                card.play(newController, false);
                card.moveTo('play area');
                this.raiseMergedEvent('onCardEntersPlay', { card: card, playingType: 'play' });
            }

            this.raiseEvent('onCardTakenControl', card);
        });
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
                faction: player.faction.name,
                agenda: player.agenda ? player.agenda.name : undefined,
                power: player.getTotalHonor()
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

        if(this.started) {
            _.each(this.getPlayers(), player => {
                playerState[player.name] = player.getState(activePlayer);
            });

            return {
                id: this.id,
                name: this.name,
                owner: this.owner,
                players: playerState,
                messages: this.gameChat.messages,
                spectators: _.map(this.getSpectators(), spectator => {
                    return {
                        id: spectator.id,
                        name: spectator.name
                    };
                }),
                started: this.started,
                winner: this.winner ? this.winner.name : undefined
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
            messages: this.gameChat.messages,
            name: this.name,
            owner: this.owner,
            players: playerSummaries,
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
