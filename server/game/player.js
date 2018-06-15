const _ = require('underscore');

const GameObject = require('./GameObject');
const Deck = require('./deck.js');
const AttachmentPrompt = require('./gamesteps/attachmentprompt.js');
const ClockSelector = require('./Clocks/ClockSelector');
const GameActions = require('./GameActions/GameActions');
const RingEffects = require('./RingEffects.js');
const PlayableLocation = require('./playablelocation.js');
const PlayerPromptState = require('./playerpromptstate.js');
const RoleCard = require('./rolecard.js');
const StrongholdCard = require('./strongholdcard.js');

class Player extends GameObject {
    constructor(id, user, owner, game, clockdetails) {
        super(game, user.username);
        this.user = user;
        this.emailHash = this.user.emailHash;
        this.id = id;
        this.owner = owner;
        this.type = 'player';

        this.dynastyDeck = _([]);
        this.conflictDeck = _([]);
        this.provinceDeck = _([]);
        this.hand = _([]);
        this.cardsInPlay = _([]); // This stores references to all characters in play.  Holdings, provinces and attachments are not stored here.
        this.strongholdProvince = _([]);
        this.provinceOne = _([]);
        this.provinceTwo = _([]);
        this.provinceThree = _([]);
        this.provinceFour = _([]);
        this.dynastyDiscardPile = _([]);
        this.conflictDiscardPile = _([]);
        this.removedFromGame = _([]);
        this.additionalPiles = {};

        this.faction = {};
        this.stronghold = null;
        this.role = null;

        //Phase Values
        this.hideProvinceDeck = false;
        this.takenDynastyMulligan = false;
        this.takenConflictMulligan = false;
        this.passedDynasty = false;
        this.honorBid = 0; // amount from the most recent bid after modifiers
        this.showBid = 0; // amount shown on the dial
        this.imperialFavor = '';

        this.clock = ClockSelector.for(this, clockdetails);

        this.deck = {};
        this.costReducers = [];
        this.playableLocations = [
            new PlayableLocation('play', this, 'hand'),
            new PlayableLocation('dynasty', this, 'province 1'),
            new PlayableLocation('dynasty', this, 'province 2'),
            new PlayableLocation('dynasty', this, 'province 3'),
            new PlayableLocation('dynasty', this, 'province 4')
        ];
        this.abilityMaxByIdentifier = {}; // This records max limits for abilities
        this.promptedActionWindows = user.promptedActionWindows || { // these flags represent phase settings
            dynasty: true,
            draw: true,
            preConflict: true,
            conflict: true,
            fate: true,
            regroup: true
        };
        this.timerSettings = user.settings.timerSettings || {};
        this.timerSettings.windowTimer = user.settings.windowTimer;
        this.optionSettings = user.settings.optionSettings;

        this.promptState = new PlayerPromptState(this);
    }

    startClock() {
        this.clock.start();
        if(this.opponent) {
            this.opponent.clock.opponentStart();
        }
    }

    stopClock() {
        this.clock.stop();
    }

    /**
     * Checks whether a card with a uuid matching the passed card is in the passed _(Array)
     * @param {_(Array)} list
     * @param {BaseCard} card
     */
    isCardUuidInList(list, card) {
        return list.any(c => {
            return c.uuid === card.uuid;
        });
    }

    /**
     * Checks whether a card with a name matching the passed card is in the passed list
     * @param {_(Array)} list
     * @param {BaseCard} card
     */
    isCardNameInList(list, card) {
        return list.any(c => {
            return c.name === card.name;
        });
    }

    /**
     * Checks whether any cards in play are currently marked as selected
     */
    areCardsSelected() {
        return this.cardsInPlay.any(card => {
            return card.selected;
        });
    }

    /**
     * Removes a card with the passed uuid from a list. Returns an _(Array)
     * @param {_(Array)} list
     * @param {String} uuid
     */
    removeCardByUuid(list, uuid) {
        return _(list.reject(card => {
            return card.uuid === uuid;
        }));
    }

    /**
     * Returns a card with the passed name in the passed list
     * @param {_(Array)} list
     * @param {String} name
     */
    findCardByName(list, name) {
        return this.findCard(list, card => card.name === name);
    }

    /**
     * Returns a card with the passed uuid in the passed list
     * @param {_(Array)} list
     * @param {String} uuid
     */
    findCardByUuid(list, uuid) {
        return this.findCard(list, card => card.uuid === uuid);
    }

    /**
     * Returns a card with the passed uuid from cardsInPlay
     * @param {String} uuid
     */
    findCardInPlayByUuid(uuid) {
        return this.findCard(this.cardsInPlay, card => card.uuid === uuid);
    }

    /**
     * Returns a card which matches passed predicate in the passed list
     * @param {_(Array)} cardList
     * @param {Function} predicate - BaseCard => Boolean
     */
    findCard(cardList, predicate) {
        var cards = this.findCards(cardList, predicate);
        if(!cards || _.isEmpty(cards)) {
            return undefined;
        }

        return cards[0];
    }

    /**
     * Returns an Array of BaseCard which match (or whose attachments match) passed predicate in the passed list
     * @param {_(Array)} cardList
     * @param {Function} predicate - BaseCard => Boolean
     */
    findCards(cardList, predicate) {
        if(!cardList) {
            return;
        }

        var cardsToReturn = [];

        cardList.each(card => {
            if(predicate(card)) {
                cardsToReturn.push(card);
            }

            if(card.attachments) {
                cardsToReturn = cardsToReturn.concat(card.attachments.filter(predicate));
            }

            return cardsToReturn;
        });

        return cardsToReturn;
    }

    /**
     * Returns the dynasty card from the passed province name
     * @param {String} location - one of 'province 1', 'province 2', 'province 3', 'province 4', 'stronghold province'
     */
    getDynastyCardInProvince(location) {
        let province = this.getSourceList(location);
        return province.find(card => card.isDynasty);
    }

    /**
     * Returns the province card from the passed province name
     * @param {String} location - one of 'province 1', 'province 2', 'province 3', 'province 4', 'stronghold province'
     */
    getProvinceCardInProvince(location) {
        let province = this.getSourceList(location);
        return province.find(card => card.isProvince);
    }

    /**
     * Returns true if any characters or attachments controlled by this playe match the passed predicate
     * @param {Function} predicate - DrawCard => Boolean
     */
    anyCardsInPlay(predicate) {
        return this.game.allCards.any(card => card.controller === this && card.location === 'play area' && predicate(card));
    }

    /**
     * Returns an Array of all characters and attachments matching the predicate controlled by this player
     * @param {Function} predicate  - DrawCard => Boolean
     */
    filterCardsInPlay(predicate) {
        return this.game.allCards.filter(card => card.controller === this && card.location === 'play area' && predicate(card));
    }

    /**
     * Returns the total number of characters and attachments controlled by this player which match the passed predicate
     * @param {Function} predicate - DrawCard => Int
     */
    getNumberOfCardsInPlay(predicate) {
        return this.game.allCards.reduce((num, card) => {
            if(card.controller === this && card.location === 'play area' && predicate(card)) {
                return num + 1;
            }

            return num;
        }, 0);
    }

    /**
     * Returns the total number of holdings controlled by this player
     */
    getNumberOfHoldingsInPlay() {
        return _.reduce(['province 1', 'province 2', 'province 3', 'province 4', 'stronghold province'], (n, province) => {
            return this.getSourceList(province).filter(card => card.getType() === 'holding' && !card.facedown).length + n;
        }, 0);
    }

    /**
     * Checks whether the passes card is in a legal location for the passed type of play
     * @param {BaseCard} card
     * @param {String} playingType
     */
    isCardInPlayableLocation(card, playingType) {
        return _.any(this.playableLocations, location => location.playingType === playingType && location.contains(card));
    }

    /**
     * Returns a character in play under this player's control which matches (for uniqueness) the passed card.
     * @param {DrawCard} card
     */
    getDuplicateInPlay(card) {
        if(!card.isUnique()) {
            return undefined;
        }

        return this.findCard(this.cardsInPlay, playCard => {
            return playCard !== card && (playCard.id === card.id || playCard.name === card.name);
        });
    }

    /**
     * Draws the passed number of cards from the top of the conflict deck into this players hand, shuffling and deducting honor if necessary
     * @param {number} numCards
     */
    drawCardsToHand(numCards) {
        let remainingCards = 0;

        if(numCards > this.conflictDeck.size()) {
            remainingCards = numCards - this.conflictDeck.size();
            numCards = this.conflictDeck.size();
        }

        for(let card of this.conflictDeck.toArray().slice(0, numCards)) {
            this.moveCard(card, 'hand');
        }

        if(remainingCards > 0) {
            this.deckRanOutOfCards('conflict');
            this.game.queueSimpleStep(() => this.drawCardsToHand(remainingCards));
        }
    }

    /**
     * Called when one of the players decks runs out of cards, removing 5 honor and shuffling the discard pile back into the deck
     * @param {String} deck - one of 'conflict' or 'dynasty'
     */
    deckRanOutOfCards(deck) {
        let discardPile = this.getSourceList(deck + ' discard pile');
        this.game.addMessage('{0}\'s {1} deck has run out of cards, so they lose 5 honor', this, deck);
        GameActions.loseHonor({ amount: 5 }).resolve(this, this.game.getFrameworkContext());
        this.game.queueSimpleStep(() => {
            discardPile.each(card => this.moveCard(card, deck + ' deck'));
            if(deck === 'dynasty') {
                this.shuffleDynastyDeck();
            } else {
                this.shuffleConflictDeck();
            }
        });
    }

    /**
     * Moves the top card of the dynasty deck to the passed province
     * @param {String} location - one of 'province 1', 'province 2', 'province 3', 'province 4'
     */
    replaceDynastyCard(location) {
        if(this.getSourceList(location).size() > 1) {
            return;
        }
        if(this.dynastyDeck.size() === 0) {
            this.deckRanOutOfCards('dynasty');
            this.game.queueSimpleStep(() => this.replaceDynastyCard(location));
        } else {
            this.moveCard(this.dynastyDeck.first(), location);
        }
    }

    /**
     * Shuffles the conflict deck, raising an event and displaying a message in chat
     */
    shuffleConflictDeck() {
        if(this.name !== 'Dummy Player') {
            this.game.addMessage('{0} is shuffling their conflict deck', this);
        }
        this.game.emitEvent('onDeckShuffled', { player: this, deck: 'conflict deck' });
        this.conflictDeck = _(this.conflictDeck.shuffle());
    }

    /**
     * Shuffles the dynasty deck, raising an event and displaying a message in chat
     */
    shuffleDynastyDeck() {
        if(this.name !== 'Dummy Player') {
            this.game.addMessage('{0} is shuffling their dynasty deck', this);
        }
        this.game.emitEvent('onDeckShuffled', { player: this, deck: 'dynasty deck' });
        this.dynastyDeck = _(this.dynastyDeck.shuffle());
    }

    /**
     * Returns the number of conflict opportunities remaining for this player
     * @param {String} type - one of 'military', 'political', ''
     * @returns {Number} opportunities remaining
     */

    getConflictOpportunities(type = '') {
        let myConflicts = this.game.completedConflicts.filter(conflict => conflict.attackingPlayer === this);
        let additionalConflicts = this.getEffects('additionalConflict');
        let maxConflicts = this.mostRecentEffect('maxConflicts') || 2 + additionalConflicts.length;
        let opportunities = Math.max(maxConflicts - myConflicts.length, 0);
        if(type) {
            let maxConflictsForType = 1 + additionalConflicts.filter(t => t === type).length;
            opportunities = Math.min(opportunities, maxConflictsForType - myConflicts.filter(conflict => conflict.declaredType === type).length);
        }
        return Math.max(opportunities, 0);
    }

    /**
     * Takes a decklist passed from the lobby, creates all the cards in it, and puts references to them in the relevant lists
     */
    prepareDecks() {
        var deck = new Deck(this.deck);
        var preparedDeck = deck.prepare(this);
        this.faction = preparedDeck.faction;
        this.provinceDeck = _(preparedDeck.provinceCards);
        if(preparedDeck.stronghold instanceof StrongholdCard) {
            this.stronghold = preparedDeck.stronghold;
        }
        if(preparedDeck.role instanceof RoleCard) {
            this.role = preparedDeck.role;
        }
        this.conflictDeck = _(preparedDeck.conflictCards);
        this.dynastyDeck = _(preparedDeck.dynastyCards);
        this.preparedDeck = preparedDeck;
        this.conflictDeck.each(card => {
            // register event reactions in case event-in-deck bluff window is enabled
            if(card.type === 'event') {
                for(let reaction of card.abilities.reactions) {
                    reaction.registerEvents();
                }
            }
        });
    }

    /**
     * Called when the Game object starts the game. Creates all cards on this players decklist, shuffles the decks and initialises player parameters for the start of the game
     */
    initialise() {
        this.prepareDecks();
        this.shuffleConflictDeck();
        this.shuffleDynastyDeck();

        this.fate = 0;
        this.honor = 0;
        this.readyToStart = false;
        this.limitedPlayed = 0;
        this.maxLimited = 1;
        this.firstPlayer = false;
        this.opponent = this.game.getOtherPlayer(this);
    }

    /**
     * Adds the passed Cost Reducer to this Player
     * @param {CostReducer} reducer
     */
    addCostReducer(reducer) {
        this.costReducers.push(reducer);
    }

    /**
     * Unregisters and removes the passed Cost Reducer from this Player
     * @param {CostReducer} reducer
     */
    removeCostReducer(reducer) {
        if(_.contains(this.costReducers, reducer)) {
            reducer.unregisterEvents();
            this.costReducers = _.reject(this.costReducers, r => r === reducer);
        }
    }

    /**
     * Checks if any Cost Reducers on this Player apply to the passed card/target, and returns the cost to play the cost if they are used
     * @param {String} playingType - not sure what legal values for this are
     * @param {DrawCard} card
     * @param {BaseCard} target
     */
    getReducedCost(playingType, card, target = null) {
        var baseCost = card.getCost();
        var matchingReducers = _.filter(this.costReducers, reducer => reducer.canReduce(playingType, card, target));
        var reducedCost = _.reduce(matchingReducers, (cost, reducer) => cost - reducer.getAmount(card), baseCost);
        return Math.max(reducedCost, 0);
    }

    /**
     * Mark all cost reducers which are valid for this card/target/playingType as used, and remove thim if they have no uses remaining
     * @param {String} playingType
     * @param {DrawCard} card
     * @param {BaseCard} target
     */
    markUsedReducers(playingType, card, target = null) {
        var matchingReducers = _.filter(this.costReducers, reducer => reducer.canReduce(playingType, card, target));
        _.each(matchingReducers, reducer => {
            reducer.markUsed();
            if(reducer.isExpired()) {
                this.removeCostReducer(reducer);
            }
        });
    }

    /**
     * Registers a card ability max limit on this Player
     * @param {String} maxIdentifier
     * @param {FixedAbilityLimit} limit
     */
    registerAbilityMax(maxIdentifier, limit) {
        if(this.abilityMaxByIdentifier[maxIdentifier]) {
            return;
        }

        this.abilityMaxByIdentifier[maxIdentifier] = limit;
        limit.registerEvents(this.game);
    }

    /**
     * Checks whether a max ability is at max
     * @param {String} maxIdentifier
     */
    isAbilityAtMax(maxIdentifier) {
        let limit = this.abilityMaxByIdentifier[maxIdentifier];

        if(!limit) {
            return false;
        }

        return limit.isAtMax(this);
    }

    /**
     * Marks the use of a max ability
     * @param {String} maxIdentifier
     */
    incrementAbilityMax(maxIdentifier) {
        let limit = this.abilityMaxByIdentifier[maxIdentifier];

        if(limit) {
            limit.increment(this);
        }
    }

    /**
     * Called at the start of the Dynasty Phase.  Resets a lot of the single round parameters
     */
    beginDynasty() {
        if(this.resetTimerAtEndOfRound) {
            this.noTimer = false;
        }

        this.cardsInPlay.each(card => {
            card.new = false;
        });

        this.modifyFate(this.getTotalIncome());

        this.game.raiseEvent('onIncomeCollected', { player: this });

        this.passedDynasty = false;
        this.limitedPlayed = 0;
    }

    showConflictDeck() {
        this.showConflict = true;
    }

    showDynastyDeck() {
        this.showDynasty = true;
    }

    /**
     * Gets the appropriate list for the passed location
     * @param {String} source
     */
    getSourceList(source) {
        switch(source) {
            case 'hand':
                return this.hand;
            case 'conflict deck':
                return this.conflictDeck;
            case 'dynasty deck':
                return this.dynastyDeck;
            case 'conflict discard pile':
                return this.conflictDiscardPile;
            case 'dynasty discard pile':
                return this.dynastyDiscardPile;
            case 'removed from game':
                return this.removedFromGame;
            case 'play area':
                return this.cardsInPlay;
            case 'province 1':
                return this.provinceOne;
            case 'province 2':
                return this.provinceTwo;
            case 'province 3':
                return this.provinceThree;
            case 'province 4':
                return this.provinceFour;
            case 'stronghold province':
                return this.strongholdProvince;
            case 'province deck':
                return this.provinceDeck;
            default:
                if(this.additionalPiles[source]) {
                    return this.additionalPiles[source].cards;
                }
        }
    }

    createAdditionalPile(name, properties) {
        this.additionalPiles[name] = _.extend({ cards: _([]) }, properties);
    }

    /**
     * Assigns the passed _(Array) to the parameter matching the passed location
     * @param {String} source
     * @param {_(Array)} targetList
     */
    updateSourceList(source, targetList) {
        switch(source) {
            case 'hand':
                this.hand = targetList;
                break;
            case 'conflict deck':
                this.conflictDeck = targetList;
                break;
            case 'dynasty deck':
                this.dynastyDeck = targetList;
                break;
            case 'conflict discard pile':
                this.conflictDiscardPile = targetList;
                break;
            case 'dynasty discard pile':
                this.dynastyDiscardPile = targetList;
                break;
            case 'removed from game':
                this.removedFromGame = targetList;
                break;
            case 'play area':
                this.cardsInPlay = targetList;
                break;
            case 'province 1':
                this.provinceOne = targetList;
                break;
            case 'province 2':
                this.provinceTwo = targetList;
                break;
            case 'province 3':
                this.provinceThree = targetList;
                break;
            case 'province 4':
                this.provinceFour = targetList;
                break;
            case 'stronghold province':
                this.strongholdProvince = targetList;
                break;
            case 'province deck':
                this.provinceDeck = targetList;
                break;
            default:
                if(this.additionalPiles[source]) {
                    this.additionalPiles[source].cards = targetList;
                }
        }
    }

    /**
     * Called when a player drags and drops a card from one location on the client to another
     * @param {String} cardId - the uuid of the dropped card
     * @param {String} source
     * @param {String} target
     */
    drop(cardId, source, target) {
        var sourceList = this.getSourceList(source);
        var card = this.findCardByUuid(sourceList, cardId);

        // Dragging is only legal in manual mode, when the card is currently in source, when the source and target are different and when the target is a legal location
        if(!this.game.manualMode || source === target || !this.isLegalLocationForCard(card, target) || card.location !== source) {
            return;
        }

        // Don't allow two province cards in one province
        if(card.isProvince && target !== 'province deck' && this.getSourceList(target).any(card => card.isProvince)) {
            return;
        }

        let display = 'a card';
        if(!card.facedown && source !== 'hand' || ['play area', 'dynasty discard pile', 'conflict discard pile', 'removed from game'].includes(target)) {
            display = card;
        }

        this.game.addMessage('{0} manually moves {1} from their {2} to their {3}', this, display, source, target);
        this.moveCard(card, target);
        this.game.checkGameState(true);
    }

    /**
     * Checks whether card.type is consistent with location
     * @param {BaseCard} card
     * @param {String} location
     */
    isLegalLocationForCard(card, location) {
        if(!card) {
            return false;
        }

        const provinceLocations = ['stronghold province', 'province 1', 'province 2', 'province 3', 'province 4'];
        const conflictCardLocations = ['hand', 'conflict deck', 'conflict discard pile', 'removed from game'];
        const legalLocations = {
            stronghold: ['stronghold province'],
            role: ['role'],
            province: [...provinceLocations, 'province deck'],
            holding: [...provinceLocations, 'dynasty deck', 'dynasty discard pile', 'removed from game'],
            character: [...provinceLocations, ...conflictCardLocations, 'dynasty deck', 'dynasty discard pile', 'play area'],
            event: [...conflictCardLocations, 'being played'],
            attachment: [...conflictCardLocations, 'play area']
        };

        return legalLocations[card.type] && legalLocations[card.type].includes(location);
    }

    /**
     * This is only used when an attachment is dragged into play.  Usually,
     * attachments are played by playCard()
     * @deprecated
     */
    promptForAttachment(card, playingType) {
        // TODO: Really want to move this out of here.
        this.game.queueStep(new AttachmentPrompt(this.game, this, card, playingType));
    }

    /**
     * Returns true if there is a conflict underway and this player is attacking
     */
    isAttackingPlayer() {
        return this.game.currentConflict && this.game.currentConflict.attackingPlayer === this;
    }

    /**
     * Returns true if there is a conflict underway and this player is defending
     */
    isDefendingPlayer() {
        return this.game.currentConflict && this.game.currentConflict.defendingPlayer === this;
    }

    resetForConflict() {
        this.cardsInPlay.each(card => {
            card.resetForConflict();
        });
    }

    get gloryModifier() {
        return this.getEffects('gloryModifier').reduce((total, value) => total + value, 0);
    }

    modifyFate(amount) {
        this.fate = Math.max(0, this.fate + amount);
    }

    modifyHonor(amount) {
        this.honor = Math.max(0, this.honor + amount);
    }

    /**
     * Returns an Array of Rings of all rings claimed by this player
     */
    getClaimedRings() {
        return _.filter(this.game.rings, ring => ring.isConsideredClaimed(this));
    }

    /**
     * Marks that this player controls the favor for the relevant conflict type
     */
    claimImperialFavor() {
        if(this.opponent) {
            this.opponent.loseImperialFavor();
        }
        let handlers = _.map(['military', 'political'], type => {
            return () => {
                this.imperialFavor = type;
                this.game.addMessage('{0} claims the Emperor\'s {1} favor!', this, type);
            };
        });
        this.game.promptWithHandlerMenu(this, {
            activePromptTitle: 'Which side of the Imperial Favor would you like to claim?',
            source: 'Imperial Favor',
            choices: ['Military', 'Political'],
            handlers: handlers
        });
    }

    /**
     * Marks that this player no longer controls the imperial favor
     */
    loseImperialFavor() {
        this.imperialFavor = '';
    }

    /**
     * Called by the game when the game starts, sets the players decklist
     * @param {*} deck
     */
    selectDeck(deck) {
        this.deck.selected = false;
        this.deck = deck;
        this.deck.selected = true;
        if(deck.stronghold.length > 0) {
            this.stronghold = new StrongholdCard(this, deck.stronghold[0]);
        }
        this.faction = deck.faction;
    }

    /**
     * Moves a card from one location to another. This involves removing in from the list it's currently in, calling DrawCard.move (which changes
     * its location property), and then adding it to the list it should now be in
     * @param {BaseCard} card
     * @param {String} targetLocation
     * @param {Object} options
     */
    moveCard(card, targetLocation, options = {}) {
        this.removeCardFromPile(card);

        if(targetLocation.endsWith(' bottom')) {
            options.bottom = true;
            targetLocation = targetLocation.replace(' bottom', '');
        }

        var targetPile = this.getSourceList(targetLocation);

        if(!this.isLegalLocationForCard(card, targetLocation) || targetPile && targetPile.contains(card)) {
            return;
        }

        let location = card.location;

        if(location === 'play area' || (card.type === 'holding' && ['province 1', 'province 2', 'province 3', 'province 4', 'stronghold province'].includes(location))) {
            if(card.owner !== this) {
                card.owner.moveCard(card, targetLocation, options);
                return;
            }

            // In normal play, all attachments should already have been removed, but in manual play we may need to remove them.
            // This is also used by Back-Alley Hideaway when it is sacrificed. This won't trigger any leaves play effects
            card.attachments.each(attachment => {
                attachment.leavesPlay();
                attachment.owner.moveCard(attachment, attachment.isDynasty ? 'dynasty discard pile' : 'conflict discard pile');
            });

            card.leavesPlay();
            card.controller = this;
        } else if(targetLocation === 'play area') {
            card.setDefaultController(this);
            card.controller = this;
            // This should only be called when an attachment is dragged into play
            if(card.type === 'attachment') {
                this.promptForAttachment(card);
                return;
            }
        } else {
            card.controller = card.owner;
        }

        card.moveTo(targetLocation);

        if(['province 1', 'province 2', 'province 3', 'province 4', 'stronghold province'].includes(targetLocation)) {
            if(['dynasty deck', 'province deck'].includes(location)) {
                card.facedown = true;
            }
            if(!this.takenDynastyMulligan && card.isDynasty) {
                card.facedown = false;
            }
            targetPile.push(card);
        } else if(['conflict deck', 'dynasty deck'].includes(targetLocation) && !options.bottom) {
            targetPile.unshift(card);
        } else if(['conflict discard pile', 'dynasty discard pile', 'removed from game'].includes(targetLocation)) {
            // new cards go on the top of the discard pile
            targetPile.unshift(card);
        } else if(targetPile) {
            targetPile.push(card);
        }
        /*
        if(['conflict discard pile', 'dynasty discard pile'].includes(targetLocation)) {
            this.game.raiseEvent('onCardPlaced', { card: card, location: targetLocation });
        }
        */
        // Replace a card which has been played, put into play or discarded from a province
        if(card.isDynasty && ['province 1', 'province 2', 'province 3', 'province 4'].includes(location) && targetLocation !== 'dynasty deck') {
            this.replaceDynastyCard(location);
        }
    }

    /**
     * Removes a card from whichever list it's currently in
     * @param {DrawCard} card
     */
    removeCardFromPile(card) {
        if(card.controller !== this) {
            card.controller.removeCardFromPile(card);
            return;
        }

        var originalLocation = card.location;
        var originalPile = this.getSourceList(originalLocation);

        if(originalPile) {
            originalPile = this.removeCardByUuid(originalPile, card.uuid);
            this.updateSourceList(originalLocation, originalPile);
        }
    }

    /**
     * Returns the amount of fate this player gets from their stronghold a turn
     */
    getTotalIncome() {
        return this.stronghold.cardData.fate;
    }

    /**
     * Returns the amount of honor this player has
     */
    getTotalHonor() {
        return this.honor;
    }

    /**
     * Sets the passed cards as selected
     * @param {BaseCard[]} cards
     */
    setSelectedCards(cards) {
        this.promptState.setSelectedCards(cards);
    }

    clearSelectedCards() {
        this.promptState.clearSelectedCards();
    }

    setSelectableCards(cards) {
        this.promptState.setSelectableCards(cards);
    }

    clearSelectableCards() {
        this.promptState.clearSelectableCards();
    }

    setSelectableRings(rings) {
        this.promptState.setSelectableRings(rings);
    }

    clearSelectableRings() {
        this.promptState.clearSelectableRings();
    }

    getSummaryForCardList(list, activePlayer, hideWhenFaceup) {
        return list.map(card => {
            return card.getSummary(activePlayer, hideWhenFaceup);
        });
    }

    getCardSelectionState(card) {
        return this.promptState.getCardSelectionState(card);
    }

    getRingSelectionState(ring) {
        return this.promptState.getRingSelectionState(ring);
    }

    currentPrompt() {
        return this.promptState.getState();
    }

    setPrompt(prompt) {
        this.promptState.setPrompt(prompt);
    }

    cancelPrompt() {
        this.promptState.cancelPrompt();
    }

    /**
     * Sets a flag indicating that this player passed the dynasty phase, and can't act again
     */
    passDynasty() {
        this.passedDynasty = true;
    }

    /**
     * Sets te value of the dial in the UI, and sends a chat message revealing the players bid
     */
    setShowBid() {
        this.showBid = this.honorBid;
        this.game.addMessage('{0} reveals a bid of {1}', this, this.showBid);
    }

    isTopConflictCardShown() {
        return this.anyEffect('showTopConflictCard');
    }

    /**
     * Resolves any number of ring effects.  If there are more than one, then it will prompt the first player to choose what order those effects should be applied in
     * @param {Array} elements - Array of String, alternatively can be passed a String for convenience
     * @param {Boolean} optional - Indicates that the player can choose which effects to resolve.  This parameter only effects resolution of a single effect
     */
    resolveRingEffects(elements, optional = true) {
        if(!Array.isArray(elements)) {
            elements = [elements];
        }
        optional = optional && elements.length === 1;
        let effects = elements.map(element => RingEffects.contextFor(this, element, optional));
        effects = _.sortBy(effects, context => this.firstPlayer ? context.ability.defaultPriority : -context.ability.defaultPriority);
        this.game.openSimultaneousEffectWindow(effects.map(context => ({ title: context.ability.title, handler: () => this.game.resolveAbility(context) })));
    }

    getStats() {
        return {
            fate: this.fate,
            honor: this.getTotalHonor(),
            conflictsRemaining: this.getConflictOpportunities(),
            militaryRemaining: this.getConflictOpportunities('military'),
            politicalRemaining: this.getConflictOpportunities('political')
        };
    }

    /**
     * This information is passed to the UI
     * @param {Player} activePlayer
     */
    getState(activePlayer) {
        let isActivePlayer = activePlayer === this;
        let promptState = isActivePlayer ? this.promptState.getState() : {};
        let state = {
            cardPiles: {
                cardsInPlay: this.getSummaryForCardList(this.cardsInPlay, activePlayer),
                conflictDiscardPile: this.getSummaryForCardList(this.conflictDiscardPile, activePlayer),
                dynastyDiscardPile: this.getSummaryForCardList(this.dynastyDiscardPile, activePlayer),
                hand: this.getSummaryForCardList(this.hand, activePlayer, true),
                removedFromGame: this.getSummaryForCardList(this.removedFromGame, activePlayer),
                provinceDeck: this.getSummaryForCardList(this.provinceDeck, activePlayer, true)
            },
            disconnected: this.disconnected,
            faction: this.faction,
            firstPlayer: this.firstPlayer,
            hideProvinceDeck: this.hideProvinceDeck,
            id: this.id,
            imperialFavor: this.imperialFavor,
            left: this.left,
            name: this.name,
            numConflictCards: this.conflictDeck.size(),
            numDynastyCards: this.dynastyDeck.size(),
            numProvinceCards: this.provinceDeck.size(),
            optionSettings: this.optionSettings,
            phase: this.game.currentPhase,
            promptedActionWindows: this.promptedActionWindows,
            provinces: {
                one: this.getSummaryForCardList(this.provinceOne, activePlayer, !this.readyToStart),
                two: this.getSummaryForCardList(this.provinceTwo, activePlayer, !this.readyToStart),
                three: this.getSummaryForCardList(this.provinceThree, activePlayer, !this.readyToStart),
                four: this.getSummaryForCardList(this.provinceFour, activePlayer, !this.readyToStart)
            },
            showBid: this.showBid,
            stats: this.getStats(),
            timerSettings: this.timerSettings,
            strongholdProvince: this.getSummaryForCardList(this.strongholdProvince, activePlayer),
            user: _.omit(this.user, ['password', 'email'])
        };

        if(this.showConflict) {
            state.showConflictDeck = true;
            state.cardPiles.conflictDeck = this.getSummaryForCardList(this.conflictDeck, activePlayer);
        }

        if(this.showDynasty) {
            state.showDynastyDeck = true;
            state.cardPiles.dynastyDeck = this.getSummaryForCardList(this.dynastyDeck, activePlayer);
        }

        if(this.role) {
            state.role = this.role.getSummary(activePlayer);
        }

        if(this.stronghold) {
            state.stronghold = this.stronghold.getSummary(activePlayer);
        }

        if(this.isTopConflictCardShown()) {
            state.conflictDeckTopCard = this.conflictDeck.first().getSummary(activePlayer);
        }

        return _.extend(state, promptState);
    }
}

module.exports = Player;
