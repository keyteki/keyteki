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
const Event = require('./Events/Event.js');
const EventWindow = require('./gamesteps/EventWindow.js');
const AtomicEventWindow = require('./gamesteps/atomiceventwindow.js');
const SimultaneousEventWindow = require('./gamesteps/simultaneouseventwindow.js');
const CardLeavesPlayEventWindow = require('./gamesteps/cardleavesplayeventwindow.js');
const InitateAbilityEventWindow = require('./gamesteps/initiateabilityeventwindow.js');
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
    /*
     * Reports errors from the game engine back to the router
     * @param {type} e
     * @returns {undefined}
     */
    reportError(e) {
        this.router.handleError(this, e);
    }

    /*
     * Adds a message to the in-game chat e.g 'Jadiel draws 1 card'
     * @param {String} message to display (can include {i} references to args)
     * @param {} args to match the references in @string
     * @returns {undefined}
     */
    addMessage() {
        this.gameChat.addMessage(...arguments);
    }
    
    /*
     * Adds a message to in-game chat with a graphical icon
     * @param {String} one of: 'endofround', 'success', 'info', 'danger', 'warning'
     * @param {String} message to display (can include {i} references to args)
     * @param {} args to match the references in @string
     * @returns {undefined}
     */
    addAlert() {
        this.gameChat.addAlert(...arguments);
    }

    get messages() {
        return this.gameChat.messages;
    }
    
    /*
     * Checks if a player is a spectator
     * @param {Object} player
     * @returns {Boolean}
     */
    isSpectator(player) {
        return player.constructor === Spectator;
    }
    
    /*
     * Checks whether a player/spectator is still in the game
     * @param {String} playerName
     * @returns {Boolean}
     */
    hasActivePlayer(playerName) {
        return this.playersAndSpectators[playerName] && !this.playersAndSpectators[playerName].left;
    }

    /*
     * Get all players (not spectators) in the game
     * @returns {Object} {name1: Player, name2: Player}
     */
    getPlayers() {
        return _.omit(this.playersAndSpectators, player => this.isSpectator(player));
    }

    /*
     * Returns the Player object (not spectator) for a name
     * @param {String} playerName
     * @returns {Player}
     */
    getPlayerByName(playerName) {
        return this.getPlayers()[playerName];
    }

    /*
     * Get all players (not spectators) with the first player at index 0
     * @returns {Array} Array of Player objects
     */
    getPlayersInFirstPlayerOrder() {
        return _.sortBy(this.getPlayers(), player => !player.firstPlayer);
    }

    /*
     * Get all players and spectators in the game
     * @returns {Object} {name1: Player, name2: Player, name3: Spectator}
     */
    getPlayersAndSpectators() {
        return this.playersAndSpectators;
    }

    /*
     * Get all spectators in the game
     * @returns {Object} {name1: Spectator, name2: Spectator}
     */
    getSpectators() {
        return _.pick(this.playersAndSpectators, player => this.isSpectator(player));
    }
    
    /*
     * Gets the current First Player
     * @returns {Player}
     */
    getFirstPlayer() {
        return _.find(this.getPlayers(), p => {
            return p.firstPlayer;
        });
    }

    /*
     * Gets a player other than the one passed (usually their opponent)
     * @param {Player} player
     * @returns {Player}
     */
    getOtherPlayer(player) {
        var otherPlayer = _.find(this.getPlayers(), p => {
            return p.name !== player.name;
        });

        return otherPlayer;
    }

    /*
     * Returns the card (i.e. character) with matching uuid from either players
     * 'in play' area. 
     * @param {String} cardId
     * @returns {DrawCard}
     */
    findAnyCardInPlayByUuid(cardId) {
        return _.reduce(this.getPlayers(), (card, player) => {
            if(card) {
                return card;
            }
            return player.findCardInPlayByUuid(cardId);
        }, null);
    }

    /*
     * Returns the card with matching uuid from anywhere in the game
     * @param {String} cardId
     * @returns {BaseCard}
     */
    findAnyCardInAnyList(cardId) {
        return this.allCards.find(card => card.uuid === cardId);
    }

    /*
     * Returns all cards (i.e. characters) which matching the passed predicated 
     * function from either players 'in play' area.
     * @param {Function} predicate - card => Boolean
     * @returns {Array} Array of DrawCard objects
     */
    findAnyCardsInPlay(predicate) {
        var foundCards = [];

        _.each(this.getPlayers(), player => {
            foundCards = foundCards.concat(player.findCards(player.cardsInPlay, predicate));
        });

        return foundCards;
    }

    /*
     * Adds a persistent/lasting/delayed effect to the effect engine
     * @param {BaseCard} source - card generating the effect
     * @param {Object} properties - properties for the effect - see effect.js
     * @returns {undefined}
     */
    addEffect(source, properties) {
        this.effectEngine.add(new Effect(this, source, properties));
    }

    /*
     * Marks a province as selected for choosing a stronghold provice at the
     * start of the game
     * @param {Player} player
     * @param {String} provinceId - uuid of the selected province
     * @returns {undefined}
     */
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

    /*
     * This function is called from the client whenever a card is clicked
     * @param {String} sourcePlayer - name of the clicking player
     * @param {String} cardId - uuid of the card clicked
     * @returns {undefined}
     */
    cardClicked(sourcePlayer, cardId) {
        var player = this.getPlayerByName(sourcePlayer);

        if(!player) {
            return;
        }

        var card = this.findAnyCardInAnyList(cardId);

        if(!card) {
            return;
        }

        // Check to see if the current step in the pipeline is waiting for input
        if(this.pipeline.handleCardClicked(player, card)) {
            return;
        }

        // If the card is in the province deck, select it
        if(card.location === 'province deck') {
            this.selectProvince(player, cardId);
            return;
        }

        // Check if the card itself is waiting for a click
        if(card.onClick(player)) {
            return;
        }

        // Look for actions or play actions for this card
        if(player.findAndUseAction(card)) {
            return;
        }

        // If it's the Dynasty phase, and this is a Dynasty card in a province, flip it face up
        if(['province 1', 'province 2', 'province 3', 'province 4'].includes(card.location) && card.controller === player && card.isDynasty) {
            if(card.facedown && this.currentPhase === 'dynasty') {
                card.facedown = false;
                this.addMessage('{0} reveals {1}', player, card);
            }
        }        
    }
   
    /*
     * This function is called from the client whenever a ring is clicked
     * @param {String} sourcePlayer - name of the clicking player
     * @param {String} ringindex - element of the ring clicked
     * @returns {undefined}
     */
    ringClicked(sourcePlayer, ringindex) {
        var ring = this.rings[ringindex];
        var player = this.getPlayerByName(sourcePlayer);

        if(!player || !ring) {
            return;
        }
        
        // Check to see if the current step in the pipeline is waiting for input
        if(this.pipeline.handleRingClicked(player, ring)) {
            return;
        }
        
        // If it's not the conflict phase and the ring hasn't been claimed, flip it
        if(this.currentPhase !== 'conflict' && !ring.claimed) {
            this.flipRing(player, ring);
        }
    }
    
    /*
     * This function is called from the client whenever the conflict deck is 
     * clicked. It's primary purpose is to support implementation of Arisan
     * Academy
     * @param {String} sourcePlayer - name of the clicking player
     * @returns {undefined}
     */
    conflictTopCardClicked(sourcePlayer) {
        let player = this.getPlayerByName(sourcePlayer);

        // If the top card of the conflict deck is hidden, don't do anything
        if(!player || player.conflictDeckTopCardHidden) {
            return;
        }
        
        let card = player.conflictDeck.first();
        
        // Check to see if the current step in the pipeline is waiting for input
        if(this.pipeline.handleCardClicked(player, card)) {
            return;
        }

        // Look for actions or play actions for this card
        player.findAndUseAction(card);
    }

    /*
     * Resets all the rings to unclaimed
     * @returns {undefined}
     */
    returnRings() {
        _.each(this.rings, ring => ring.resetRing());
    }
    
    /*
     * @deprecated
     * @param {type} card
     * @param {type} menuItem
     * @returns {Boolean}
     */
    cardHasMenuItem(card, menuItem) {
        return card.menu && card.menu.any(m => {
            return m.method === menuItem.method;
        });
    }

    /* 
     * Handles clicks on menu commands from in-play cards
     * @deprecated
     * @param {type} card
     * @param {type} player
     * @param {type} menuItem
     * @returns {undefined}
     * 
     */
    callCardMenuCommand(card, player, menuItem) {
        if(!card || !card[menuItem.method] || !this.cardHasMenuItem(card, menuItem)) {
            return;
        }

        card[menuItem.method](player, menuItem.arg);
    }

    /*
     * This function is called by the client when a card menu item is clicked
     * TO DO: handle this more elegantly with a separate class?
     * @param {String} sourcePlayer - name of clicking player
     * @param {String} cardId - uuid of card whose menu was clicked
     * @param {Object} menuItem - { command: String, text: String, arg: String, method: String }
     * @returns {undefined}
     */
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
        
        /* deprecated code
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

    /*
     * This function is called by the client when a ring menu item is clicked
     * TO DO: handle this more elegantly with a separate class?
     * @param {String} sourcePlayer - name of clicking player
     * @param {Object} sourceRing - not sure what this is, but it has an element!
     * @param {Object} menuItem - { command: String, text: String, arg: String, method: String }
     * @returns {undefined}
     */
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

    /*
     * Sets a Player flag and displays a chat message to show that a popup with a
     * player's conflict deck is open
     * @param {String} playerName
     * @returns {undefined}
     */
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

    /*
     * Sets a Player flag and displays a chat message to show that a popup with a
     * player's dynasty deck is open
     * @param {String} playerName
     * @returns {undefined}
     */
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
    
    /*
     * This function is called from the client whenever a card is dragged from
     * one place to another
     * @param {String} playerName
     * @param {String} cardId - uuid of card
     * @param {String} source - area where the card was dragged from
     * @param {String} target - area where the card was dropped
     * @returns {undefined}
     */
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

    /*
     * Change a players total honor
     * @param {Player} player
     * @param {Int} honor
     * @returns {undefined}
     */
    addHonor(player, honor) {
        player.honor += honor;

        if(player.honor < 0) {
            player.honor = 0;
        }

        this.checkWinCondition(player);
    }

    /*
     * Change a players total fate
     * @param {Player} player
     * @param {Int} fate
     * @returns {undefined}
     */
    addFate(player, fate) {
        player.fate += fate;

        if(player.fate < 0) {
            player.fate = 0;
        }
    }

    /*
     * Transfer honor from one player to another (NB: parameters for honor are
     * the opposite way round to those for fate!)
     * @param {Player} source
     * @param {Player} target
     * @param {Int} honor
     * @returns {undefined}
     */
    transferHonor(source, target, honor) {
        var appliedHonor = Math.min(source.honor, honor);
        source.honor -= appliedHonor;
        target.honor += appliedHonor;

        this.checkWinCondition(target);
        this.checkWinCondition(source);
    }

    /*
     * Transfer fate from one player to another (NB: parameters for honor are
     * the opposite way round to those for fate!)
     * @param {Player} to
     * @param {Player} from
     * @param {Int} fate
     * @returns {undefined}
     */
    transferFate(to, from, fate) {
        var appliedFate = Math.min(from.fate, fate);

        from.fate -= appliedFate;
        to.fate += appliedFate;

        this.raiseEvent('onFateTransferred', { source: from, target: to, amount: fate });
    }

    /*
     * Check to see if this player has won/lost the game due to honor (NB: this
     * function doesn't check to see if a conquest victory has been achieved) 
     * @param {Player} player
     * @returns {undefined}
     */
    checkWinCondition(player) {
        if(player.getTotalHonor() >= 25) {
            this.recordWinner(player, 'honor');
        } else if(player.getTotalHonor() === 0) {
            var opponent = this.getOtherPlayer(player);
            this.recordWinner(opponent, 'dishonor');
        }

    }

    /*
     * Display message declaring victory for one player, and record stats for
     * the game
     * @param {Player} winner
     * @param {String} reason
     * @returns {undefined}
     */
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
    
    /*
     * Designate a player as First Player
     * @param {Player} firstPlayer
     * @returns {undefined}
     */
    setFirstPlayer(firstPlayer) {
        _.each(this.getPlayers(), player => {
            if(player === firstPlayer) {
                player.firstPlayer = true;
            } else {
                player.firstPlayer = false;
            }
        });
    }

    /*
     * Changes a Player variable and displays a message in chat
     * @deprecated
     * @param {String} playerName
     * @param {String} stat
     * @param {Int} value
     * @returns {undefined}
     */
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

    /* 
     * This function is called by the client every time a player enters a chat message
     * @param {String} playerName
     * @param {String} message
     * @returns {undefined}
     */
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

    /*
     * This is called by the client when a player clicks 'Concede'
     * @param {String} playerName
     * @returns {undefined}
     */
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

    /*
     * Called when a player clicks Shuffle Deck on the conflict deck menu in
     * the client
     * @param {String} playerName
     * @returns {undefined}
     */
    shuffleConflictDeck(playerName) {
        var player = this.getPlayerByName(playerName);
        if(!player) {
            return;
        }

        player.shuffleConflictDeck();
    }

    /*
     * Called when a player clicks Shuffle Deck on the dynasty deck menu in
     * the client
     * @param {String} playerName
     * @returns {undefined}
     */
    shuffleDynastyDeck(playerName) {
        var player = this.getPlayerByName(playerName);
        if(!player) {
            return;
        }

        player.shuffleDynastyDeck();
    }

    /*
     * Prompts a player with a multiple choice menu
     * @param {Player} player
     * @param {Object} contextObj - the object which contains the methods that are referenced by the menubuttons
     * @param {Object} properties - see menuprompt.js
     * @returns {undefined}
     */
    promptWithMenu(player, contextObj, properties) {
        this.queueStep(new MenuPrompt(this, player, contextObj, properties));
    }

    /*
     * Prompts a player with a multiple choice menu
     * @param {Player} player
     * @param {Object} properties - see handlermenuprompt.js
     * @returns {undefined}
     */
    promptWithHandlerMenu(player, properties) {
        this.queueStep(new HandlerMenuPrompt(this, player, properties));
    }

    /*
     * Prompts a player to click a card
     * @param {Player} player
     * @param {Object} properties - see selectcardprompt.js
     * @returns {undefined}
     */
    promptForSelect(player, properties) {
        this.queueStep(new SelectCardPrompt(this, player, properties));
    }

    /*
     * Prompts a player to click a ring
     * @param {Player} player
     * @param {Object} properties - see selectringprompt.js
     * @returns {undefined}
     */
    promptForRingSelect(player, properties) {
        this.queueStep(new SelectRingPrompt(this, player, properties));
    }

    /*
     * Prompts a player with a multiple choice menu which corresponds to cards
     * in their conflict deck
     * TO DO: this is basically deprecated - needs new functionality using popups
     * @param {type} player
     * @param {type} properties
     * @returns {undefined}
     */
    promptForDeckSearch(player, properties) {
        this.raiseEvent('onBeforeDeckSearch', { source: properties.source, player: player }, event => {
            this.queueStep(new DeckSearchPrompt(this, event.player, properties));
        });
    }

    /*
     * This function is called by the client whenever a player clicks a button
     * in a prompt
     * @param {String} playerName
     * @param {String} arg - arg property of the button clicked
     * @param {String} uuid - unique identifier of the prompt clicked
     * @param {String} method - method property of the button clicked
     * @returns {Boolean} no idea what this does...
     */
    menuButton(playerName, arg, uuid, method) {
        var player = this.getPlayerByName(playerName);
        if(!player) {
            return false;
        }

        // check to see if the current step in the pipeline is waiting for input
        if(this.pipeline.handleMenuCommand(player, arg, uuid, method)) {
            return true;
        }
    }
    
    /*
     * This function is called by the client when a player clicks an action window
     * toggle in the settings menu
     * @param {String} playerName
     * @param {String} windowName - the name of the action window being toggled
     * @param {Boolean} toggle - the new setting of the toggle
     * @returns {undefined}
     */
    togglePromptedActionWindow(playerName, windowName, toggle) {
        var player = this.getPlayerByName(playerName);
        if(!player) {
            return;
        }

        player.promptedActionWindows[windowName] = toggle;
    }

    /*
     * This function is called by the client when a player clicks an timer setting
     * toggle in the settings menu
     * @param {String} playerName
     * @param {String} settingName - the name of the setting being toggled
     * @param {Boolean} toggle - the new setting of the toggle
     * @returns {undefined}
     */
    toggleTimerSetting(playerName, settingName, toggle) {
        var player = this.getPlayerByName(playerName);
        if(!player) {
            return;
        }

        player.timerSettings[settingName] = toggle;
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
        var player = this.getPlayerByName(playerName);
        if(!player) {
            return;
        }

        player.optionSettings[settingName] = toggle;
    }

    /*
     * Sets up Player objects, creates allCards, checks each player has a stronghold
     * and starts the game pipeline
     * @returns {undefined}
     */
    initialise() {
        var players = {};

        _.each(this.playersAndSpectators, player => {
            if(!player.left) {
                players[player.name] = player;
            }
        });

        this.playersAndSpectators = players;

        let playerWithNoStronghold = null;

        _.each(this.getPlayers(), player => {
            player.initialise();
            if(!player.stronghold) {
                playerWithNoStronghold = player;
            }
        });
        
        this.allCards = _(_.reduce(this.getPlayers(), (cards, player) => {
            return cards.concat(player.preparedDeck.allCards);
        }, []));

        if(playerWithNoStronghold) {
            this.addMessage('{0} does not have a stronghold in their decklist', playerWithNoStronghold);
            return;
        }

        this.pipeline.initialise([
            new SetupPhase(this),
            new SimpleStep(this, () => this.beginRound())
        ]);

        this.playStarted = true;
        this.startedAt = new Date();

        this.continue();
    }

    /*
     * Adds each of the game's main phases to the pipeline
     * @returns {undefined}
     */
    beginRound() {
        this.raiseEvent('onBeginRound');
        this.queueStep(new DynastyPhase(this));
        this.queueStep(new DrawPhase(this));
        this.queueStep(new ConflictPhase(this));
        this.queueStep(new FatePhase(this));
        this.queueStep(new RegroupPhase(this));
        this.queueStep(new SimpleStep(this, () => this.beginRound()));
    }

    /*
     * Adds a step to the pipeline queue
     * @param {BaseStep} step
     * @returns {undefined}
     */
    queueStep(step) {
        this.pipeline.queueStep(step);
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
     * Tells the current action window that the player with priority has taken
     * an action (and so priority should pass to the other player)
     * @returns {undefined}
     */
    markActionAsTaken() {
        if(this.currentActionWindow) {
            this.currentActionWindow.markActionAsTaken();
        }
    }

    /*
     * Gets context on the card ability currently being resolved
     * @deprecated
     * @returns {Object} - { source: String, card: BaseCard, stage: String }
     */
    getCurrentAbilityContext() {
        return _.last(this.abilityCardStack);
    }

    /*
     * Adds information of the card ability currently being resolved to the
     * ability stack
     * @deprecated
     * @param {String} source
     * @param {BaseCard} card
     * @param {String} stage
     * @returns {undefined}
     */
    pushAbilityContext(source, card, stage) {
        this.abilityCardStack.push({ source: source, card: card, stage: stage });
    }

    /*
     * Remove information about the current card ability being resolved (because
     * it has finished resolving, or moved to a different stage of resolution)
     * @returns {undefined}
     */
    popAbilityContext() {
        this.abilityCardStack.pop();
    }

    /*
     * Resolves a card ability or ring effect
     * @param {AbilityContext} context - see AbilityContext.js
     * @returns {undefined}
     */
    resolveAbility(context) {
        this.queueStep(new AbilityResolver(this, context));
    }

    /*
     * Opens a window for triggered card abilities to respond to an Event and
     * adds it to the window stack
     * @param {Object} properties - { abilityType: String, event: Event or Array of Event }
     * @returns {undefined}
     */
    openAbilityWindow(properties) {
        let windowClass = ['forcedreaction', 'forcedinterrupt', 'whenrevealed'].includes(properties.abilityType) ? ForcedTriggeredAbilityWindow : TriggeredAbilityWindow;
        let window = new windowClass(this, { abilityType: properties.abilityType, event: properties.event });
        this.abilityWindowStack.push(window);
        window.emitEvents();
        this.queueStep(window);
        this.queueSimpleStep(() => this.abilityWindowStack.pop());
    }

    /*
     * Looks for any currently open event windows on the stack which might trigger
     * a new ability (from a card which has e.g. come into play, and registers
     * the ability in those windows so it can respond to those events
     * @param {BaseAbility} ability
     * @param {Event} event - event which triggers ability
     * @returns {undefined}
     */
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

    /*
     * Creates a game Event, and opens a window for it.
     * @param {String} eventName
     * @param {Object} params - parameters for this event
     * @param {Function} handler - (Event + params) => undefined
     * @returns {Event} - this allows the caller to track Event.resolved and
     * tell whether or not the handler resolved successfully
     */
    raiseEvent(eventName, params, handler) {
        let event = new Event(eventName, params, handler);
        this.openEventWindow([event]);
        return event;
    }
    
    /* Creates an EventWindow which will open windows for each kind of triggered 
     * ability which can respond any passed events, and execute their handlers.
     * @param {type} events - Array of Event
     * @returns {undefined}
     */
    openEventWindow(events) {
        if(!_.isArray(events)) {
            events = [events];
        }
        this.queueStep(new EventWindow(this, events));
    }

    /**
     * Raises multiple events whose resolution is performed atomically. Any
     * abilities triggered by these events will appear within the same prompt
     * for the player. NB: this doesn't execute any handlers on passed events
     * @deprecated
     * @param {Array} events - Array of Event
     * @param {Function} handler - () => undefined
     * @returns {undefined}
     */
    raiseAtomicEvent(events, handler = () => true) {
        this.queueStep(new AtomicEventWindow(this, events, handler));
    }

    /**
     * Raises the same event across multiple cards as well as a wrapping plural
     * version of the event that lists all cards.
     * @deprecated
     * @param {Array} cards - Array of BaseCard
     * @param {Object} properties - { eventName: String, handler: Function, perCardEventName: String, perCardHandler: Function, params: Object }
     * @returns {undefined}
     */
    raiseSimultaneousEvent(cards, properties) {
        this.queueStep(new SimultaneousEventWindow(this, cards, properties));
    }

    /**
     * Raises a custom event window for dealing with cards leaving play. Creates
     * separate contingent events for any attachments on the card leaving play,
     * and creates a separate sacrifice event if required. Moves the card to the
     * specified destination during execution
     * @deprecated
     * @param {DrawCard} card - card leaving play
     * @param {String} destination
     * @param {Boolean} isSacrifice
     * @returns {undefined}
     */
    raiseCardLeavesPlayEvent(card, destination, isSacrifice = false) {
        this.queueStep(new CardLeavesPlayEventWindow(this, card, destination, isSacrifice));
    }

    /**
     * Raises a custom event window for checking for any cancels to a card 
     * ability
     * @param {AbilityContext} context -
     * @returns {undefined}
     */
    raiseInitiateAbilityEvent(context) {
        this.queueStep(new InitateAbilityEventWindow(this, context));
    }

    /**
     * Raises multiple events whose resolution is performed atomically. Any
     * abilities triggered by these events will appear within the same prompt
     * for the player. Allows each event to take its own handler which will
     * all execute in the same step
     * @param {Array} events - Array of { name: String, params: Object, handler: Function }
     * @param {Object} conditionalEvent - { name: String, params: Object, handler: Function },
     * this event should be made conditional on any of the others not having
     * been cancelled
     * @returns {Array} Array of Event
     */
    raiseMultipleEvents(events, conditionalEvent = null) {
        events = events.map(event => new Event(event.name, event.params, event.handler));
        if(conditionalEvent) {
            conditionalEvent = new Event(conditionalEvent.name, conditionalEvent.params, conditionalEvent.handler);
            conditionalEvent.condition = () => events.any(event => !event.cancelled);
            this.openEventWindow(events.concat([conditionalEvent]));
            return events.concat([conditionalEvent]);
        }
        this.openEventWindow(events);
        return events;
    }

    /*
     * Flips a ring to show the opposite side (military or political)
     * @param {Player} player
     * @param {Ring} ring
     * @returns {undefined}
     */
    flipRing(player, ring) {
        ring.flipConflictType();
    }

    /*
     * Puts 1 fate on all unclaimed rings
     * @returns {undefined}
     */
    placeFateOnUnclaimedRings() {
        _.each(this.rings, ring => {
            if(!ring.claimed) {
                ring.modifyFate(1);
            }
        });
    }

    /*
     * Transfers honor equal to the difference in bids from the high bidder to
     * the low bidder
     * @returns {undefined}
     */
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
    
    /*
     * Changes the controller of a card in play to the passed player, and cleans
     * all the related stuff up (swapping sides in a conflict, checking for
     * illegal attachments, etc)
     * @param {Player} player
     * @param {DrawCard} card
     * @returns {undefined}
     */
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
    
    /*
     * Starts a duel between two characters. Prompts for bids, deals with costs
     * of bids, and then resolves the outcome
     * @param {DrawCard} source - card which initiated the duel
     * @param {DrawCard} target - other card partipating in duel
     * @param {Function} resolutionHandler - (winner, loser) => undefined //
     * function which deals with any effects due to winning/losing the duel
     * @param {type} costHandler - () => undefined // function which resolves 
     * costsas a result of bids (transfering honor is the default)
     * @returns {undefined}
     */
    initiateDuel(source, target, resolutionHandler, costHandler = () => this.tradeHonorAfterBid()) {
        let totals = source.name + ': ' + parseInt(source.getMilitarySkill()) + ' vs ' + parseInt(target.getMilitarySkill()) + ': ' + target.name;
        this.queueStep(new HonorBidPrompt(this, 'Choose your bid for the duel\n' + totals));
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

    /*
     * Checks whether a game action can be performed on a card or an array of 
     * cards, and performs it on all legal targets.
     * @deprecated
     * @param {String} actionType
     * @param {Array or BaseCard} cards - Array of BaseCard
     * @param {Function} func - (Array or BaseCard) => undefined
     * @returns {undefined}
     */
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

    /*
     * This information is all logged when a game is won
     */
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

    /*
     * This information is sent to the client
     */
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

    /*
     * This is used for debugging?
     */
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
