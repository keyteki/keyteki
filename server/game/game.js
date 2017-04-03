const _ = require('underscore');
const EventEmitter = require('events');

const ChatCommands = require('./chatcommands.js');
const GameChat = require('./gamechat.js');
const EffectEngine = require('./effectengine.js');
const Effect = require('./effect.js');
const Player = require('./player.js');
const Spectator = require('./spectator.js');
const GamePipeline = require('./gamepipeline.js');
const SetupPhase = require('./gamesteps/setupphase.js');
const PlotPhase = require('./gamesteps/plotphase.js');
const DrawPhase = require('./gamesteps/drawphase.js');
const MarshalingPhase = require('./gamesteps/marshalingphase.js');
const ChallengePhase = require('./gamesteps/challengephase.js');
const DominancePhase = require('./gamesteps/dominancephase.js');
const StandingPhase = require('./gamesteps/standingphase.js');
const TaxationPhase = require('./gamesteps/taxationphase.js');
const SimpleStep = require('./gamesteps/simplestep.js');
const MenuPrompt = require('./gamesteps/menuprompt.js');
const SelectCardPrompt = require('./gamesteps/selectcardprompt.js');
const EventWindow = require('./gamesteps/eventwindow.js');
const AbilityResolver = require('./gamesteps/abilityresolver.js');
const ForcedTriggeredAbilityWindow = require('./gamesteps/forcedtriggeredabilitywindow.js');
const TriggeredAbilityWindow = require('./gamesteps/triggeredabilitywindow.js');

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
        this.abilityWindowStack = [];

        _.each(details.players, player => {
            this.playersAndSpectators[player.user.username] = new Player(player.id, player.user, this.owner === player.user.username, this);
        });

        _.each(details.spectators, spectator => {
            this.playersAndSpectators[spectator.user.username] = new Spectator(spectator.id, spectator.user);
        });

        this.setMaxListeners(0);

        this.router = options.router;
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

    anyPlotHasTrait(trait) {
        return _.any(this.getPlayers(), player =>
            player.activePlot &&
            player.activePlot.hasTrait(trait));
    }

    addEffect(source, properties) {
        this.effectEngine.add(new Effect(this, source, properties));
    }

    selectPlot(player, plotId) {
        var plot = player.findCardByUuid(player.plotDeck, plotId);

        if(!plot) {
            return;
        }

        player.plotDeck.each(p => {
            p.selected = false;
        });

        plot.selected = true;
    }

    factionCardClicked(sourcePlayer) {
        var player = this.getPlayerByName(sourcePlayer);

        if(!player) {
            return;
        }

        if(player.faction.kneeled) {
            player.standCard(player.faction);
        } else {
            player.kneelCard(player.faction);
        }

        this.addMessage('{0} {1} their faction card', player, player.faction.kneeled ? 'kneels' : 'stands');
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

        if(card.location === 'plot deck') {
            this.selectPlot(player, cardId);
            return;
        }

        if(this.pipeline.handleCardClicked(player, card)) {
            return;
        }

        // Attempt to play cards that are not already in the play area.
        if(['hand', 'discard pile', 'dead pile'].includes(card.location) && player.playCard(card)) {
            return;
        }

        if(card.onClick(player)) {
            return;
        }

        if(!card.facedown && card.location === 'play area' && card.controller === player) {
            if(card.kneeled) {
                player.standCard(card);
            } else {
                player.kneelCard(card);
            }

            this.addMessage('{0} {1} {2}', player, card.kneeled ? 'kneels' : 'stands', card);
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
            case 'active plot':
                this.callCardMenuCommand(player.activePlot, player, menuItem);
                break;
            case 'agenda':
                this.callCardMenuCommand(player.agenda, player, menuItem);
                break;
            case 'play area':
                if(card.controller !== player && !menuItem.anyPlayer) {
                    return;
                }

                this.callCardMenuCommand(card, player, menuItem);
                break;
        }
    }

    showDrawDeck(playerName) {
        var player = this.getPlayerByName(playerName);

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

    drop(playerName, cardId, source, target) {
        var player = this.getPlayerByName(playerName);

        if(!player) {
            return;
        }

        if(player.drop(cardId, source, target)) {
            var movedCard = 'a card';
            if(!_.isEmpty(_.intersection(['dead pile', 'discard pile', 'out of game', 'play area'],
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

    addPower(player, power) {
        player.faction.power += power;

        if(player.faction.power < 0) {
            player.faction.power = 0;
        }

        this.raiseEvent('onStatChanged', player, 'power');

        this.checkWinCondition(player);
    }

    addGold(player, gold) {
        player.gold += gold;

        if(player.gold < 0) {
            player.gold = 0;
        }

        this.raiseEvent('onStatChanged', player, 'gold');
    }

    transferPower(winner, loser, power) {
        var appliedPower = Math.min(loser.faction.power, power);
        loser.faction.power -= appliedPower;
        winner.faction.power += appliedPower;

        this.raiseEvent('onStatChanged', loser, 'power');
        this.raiseEvent('onStatChanged', winner, 'power');

        this.checkWinCondition(winner);
    }

    transferGold(to, from, gold) {
        var appliedGold = Math.min(from.gold, gold);

        from.gold -= appliedGold;
        to.gold += appliedGold;

        this.raiseEvent('onStatChanged', from, 'gold');
        this.raiseEvent('onStatChanged', to, 'gold');
    }

    checkWinCondition(player) {
        if(player.getTotalPower() >= 15) {
            this.addMessage('{0} has won the game', player);

            if(!this.winner) {
                this.winner = player;
                this.finishedAt = new Date();
                this.winReason = 'power';

                this.router.gameWon(this, 'power', player);
            }
        }
    }

    playerDecked(player) {
        var otherPlayer = this.getOtherPlayer(player);

        if(otherPlayer) {
            this.addMessage('{0}\'s draw deck is empty', player);
            this.addMessage('{0} has won the game', otherPlayer);

            if(!this.winner) {
                this.winner = player;
                this.finishedAt = new Date();
                this.winReason = 'decked';

                this.router.gameWon(this, 'decked', player);
            }
        }
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
            this.addMessage('{0} wins the game', otherPlayer);

            if(!this.winner) {
                this.winner = otherPlayer;
                this.finishedAt = new Date();
                this.winReason = 'concede';

                this.router.gameWon(this, 'concede', otherPlayer);
            }
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

    menuButton(playerName, arg, method) {
        var player = this.getPlayerByName(playerName);
        if(!player) {
            return;
        }

        if(this.pipeline.handleMenuCommand(player, arg, method)) {
            return true;
        }
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
        this.queueStep(new PlotPhase(this));
        this.queueStep(new DrawPhase(this));
        this.queueStep(new MarshalingPhase(this));
        this.queueStep(new ChallengePhase(this));
        this.queueStep(new DominancePhase(this));
        this.queueStep(new StandingPhase(this));
        this.queueStep(new TaxationPhase(this));
        this.queueStep(new SimpleStep(this, () => this.beginRound()));
    }

    queueStep(step) {
        this.pipeline.queueStep(step);
    }

    queueSimpleStep(handler) {
        this.pipeline.queueStep(new SimpleStep(this, handler));
    }

    resolveAbility(ability, context) {
        this.queueStep(new AbilityResolver(this.game, ability, context));
    }

    openAbilityWindow(properties) {
        let windowClass = ['forcedreaction', 'forcedinterrupt'].includes(properties.abilityType) ? ForcedTriggeredAbilityWindow : TriggeredAbilityWindow;
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

    takeControl(player, card) {
        var oldController = card.controller;
        var newController = player;

        if(oldController === newController) {
            return;
        }

        oldController.removeCardFromPile(card);
        newController.cardsInPlay.push(card);
        card.controller = newController;

        if(card.location !== 'play area') {
            card.play(newController, false);
            card.moveTo('play area');
            this.raiseEvent('onCardEntersPlay', card);
        }

        this.raiseEvent('onCardTakenControl', card);
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
                power: player.getTotalPower()
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

    getState(activePlayer) {
        var playerState = {};

        if(this.started) {
            _.each(this.getPlayers(), player => {
                playerState[player.name] = player.getState(activePlayer === player.name);
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

        return this.getSummary(activePlayer);
    }

    getSummary(activePlayer) {
        var playerSummaries = {};

        _.each(this.getPlayers(), player => {
            var deck = undefined;
            if(player.left) {
                return;
            }

            if(activePlayer === player.name && player.deck) {
                deck = { name: player.deck.name, selected: player.deck.selected };
            } else if(player.deck) {
                deck = { selected: player.deck.selected };
            } else {
                deck = {};
            }

            playerSummaries[player.name] = {
                agenda: player.agenda ? player.agenda.code : undefined,
                deck: deck,
                emailHash: player.emailHash,
                faction: player.faction.code,
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
