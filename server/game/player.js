const _ = require('underscore');

const Spectator = require('./spectator.js');
const Deck = require('./deck.js');
const AbilityContext = require('./AbilityContext.js');
const AttachmentPrompt = require('./gamesteps/attachmentprompt.js');
const ConflictTracker = require('./conflicttracker.js');
const RingEffects = require('./RingEffects.js');
const PlayableLocation = require('./playablelocation.js');
const PlayActionPrompt = require('./gamesteps/playactionprompt.js');
const PlayerPromptState = require('./playerpromptstate.js');
const RoleCard = require('./rolecard.js');
const StrongholdCard = require('./strongholdcard.js');

const StartingHandSize = 4;
const DrawPhaseCards = 1;

class Player extends Spectator {
    constructor(id, user, owner, game) {
        super(id, user);

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
        this.additionalPiles = {};

        this.faction = {};
        this.stronghold = null;
        this.role = null;

        this.owner = owner;
        this.game = game;

        //Phase Values
        this.takenDynastyMulligan = false;
        this.takenConflictMulligan = false;
        this.passedDynasty = false;
        this.honorBid = 0; // amount from the most recent bid after modifiers
        this.showBid = 0; // amount shown on the dial
        this.imperialFavor = '';
        this.totalGloryForFavor = 0;
        this.gloryModifier = 0;


        this.deck = {};
        this.conflicts = new ConflictTracker();
        this.costReducers = [];
        this.playableLocations = [
            new PlayableLocation('play', this, 'hand'),
            new PlayableLocation('dynasty', this, 'province 1'),
            new PlayableLocation('dynasty', this, 'province 2'),
            new PlayableLocation('dynasty', this, 'province 3'),
            new PlayableLocation('dynasty', this, 'province 4')
        ];
        this.cannotGainConflictBonus = false; // I have no idea what this is for
        this.abilityRestrictions = []; // This stores player restrictions from e.g. Guest of Honor
        this.abilityMaxByIdentifier = {}; // This records max limits for abilities
        this.canInitiateAction = false; // This flag determines whether this player has priority in an action window
        this.conflictDeckTopCardHidden = true;
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

        this.createAdditionalPile('out of game', { title: 'Out of Game', area: 'player row' });

        this.promptState = new PlayerPromptState();
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
     * Moves provinces from the province deck to provinces. The card marked as selected will be moved to the stronghold province.
     */
    placeProvinces() {
        let provinceId = ['1', '2', '3', '4'];
        // Fisher-Yates shuffle the array
        var i = provinceId.length, t, j;
        provinceId = provinceId.slice();
        while (--i) t = provinceId[i], provinceId[i] = provinceId[j = ~~(Math.random() * (i+1))], provinceId[j] = t; //eslint-disable-line

        let provinceIterator = 0;
        this.provinceDeck.each(card => {
            if(card.selected) {
                card.selected = false;
                this.moveCard(card, 'stronghold province');
            } else {
                var province = 'province ' + provinceId[provinceIterator];
                this.moveCard(card, province);
                provinceIterator = provinceIterator + 1;
            }

        });
    }

    /**
     * Moves the stronghold and the role card from an out-of-game state to their normal positions
     */
    attachStronghold() {
        this.moveCard(this.stronghold, 'stronghold province');
        if(this.role) {
            this.role.moveTo('role');
        }
    }

    /**
     * Fills all empty provinces, and flips non empty provinces faceup
     */
    fillProvinces() {
        var provinces = ['province 1', 'province 2', 'province 3', 'province 4'];

        _.each(provinces, province => {
            let card = this.getDynastyCardInProvince(province);
            if(card) {
                card.facedown = false;
            } else {
                this.moveCard(this.dynastyDeck.first(), province);
                card = this.getDynastyCardInProvince(province);
                card.facedown = false;
            }
        });
    }

    /**
     * Flips all province cards face up, and sends a message saying what has been revealed
     */
    flipDynastyCards() {
        let revealedCards = [];
        _.each(['province 1', 'province 2', 'province 3', 'province 4'], province => {
            let card = this.getDynastyCardInProvince(province);
            if(card && card.facedown) {
                this.game.raiseEvent('onDynastyCardTurnedFaceup', { player: this, card: card }, () => card.facedown = false);
                revealedCards.push(card);
            }
        });
        if(revealedCards.length > 0) {
            this.game.queueSimpleStep(() => this.game.addMessage('{0} reveals {1}', this, revealedCards));
        }
    }

    /**
     * Returns the dynasty card from the passed province name
     * @param {String} location - one of 'province 1', 'province 2', 'province 3', 'province 4'
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
        return _.reduce(['province 1', 'province 2', 'province 3', 'province 4'], (n, province) => {
            if(this.getSourceList(province).any(card => card.getType() === 'holding' && !card.facedown)) {
                return n + 1;
            }
            return n;
        }, 0);
    }

    /**
     * Checks whether the passes card is in a legal location for the passed type of play
     * TODO: This isn't currently used by the code, but could be a better solution than what we're currently using for e.g. Artisan Academy
     * @param {BaseCard} card 
     * @param {String} playingType 
     */
    isCardInPlayableLocation(card, playingType) {
        return _.any(this.playableLocations, location => location.playingType === playingType && location.contains(card));
    }

    /**
     * Returns a card in play under this player's control which matches (for uniqueness) the passed card.
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
     * Returns the number of conflicts won by this player of the passed type
     * @param {String} conflictType - one of 'military', 'political'
     */
    getNumberOfConflictsWon(conflictType) {
        return this.conflicts.getWon(conflictType);
    }

    /**
     * Returns the number of conflicts lost by this player of the passed type
     * @param {String} conflictType - one of 'military', 'political'
     */
    getNumberOfConflictsLost(conflictType) {
        return this.conflicts.getLost(conflictType);
    }

    /**
     * Returns the number of conflicts initiated by this player of the passed type
     * @param {String} conflictType - one of 'military', 'political'
     */
    getNumberOfConflictsInitiatedByType(conflictType) {
        return this.conflicts.getPerformed(conflictType);
    }

    /**
     * Returns the number of conflicts initiated by this player
     */
    getNumberOfConflictsInitiated() {
        return this.conflicts.complete;
    }

    /**
     * Draws the passed number of cards from the top of the conflict deck into this players hand, shuffling and deducting honor if necessary
     * @param {Int} numCards 
     */
    drawCardsToHand(numCards) {
        let remainingCards = 0;

        if(numCards > this.conflictDeck.size()) {
            remainingCards = numCards - this.conflictDeck.size();
            numCards = this.conflictDeck.size();
        }

        var cards = this.conflictDeck.first(numCards);
        _.each(cards, card => {
            this.moveCard(card, 'hand');
        });

        if(this.game.currentPhase !== 'setup') {
            this.game.raiseEvent('onCardsDrawn', { cards: cards, player: this });
        }

        if(remainingCards > 0) {
            this.deckRanOutOfCards('conflict');
            let moreCards = this.conflictDeck.first(remainingCards);
            _.each(moreCards, card => this.moveCard(card, 'hand'));
            cards = cards.concat(moreCards);
        }

        return (cards.length > 1) ? cards : cards[0];
    }

    /**
     * Called when one of the players decks runs out of cards, removing 5 honor and shuffling the discard pile back into the deck
     * @param {String} deck - one of 'conflict' or 'dynasty' 
     */
    deckRanOutOfCards(deck) {
        this.game.addMessage('{0}\'s {1} deck has run out of cards and loses 5 honor', this, deck);
        this.game.addHonor(this, -5);
        this.getSourceList(deck + ' discard pile').each(card => this.moveCard(card, deck + ' deck'));
        if(deck === 'dynasty') {
            this.shuffleDynastyDeck();
        } else {
            this.shuffleConflictDeck();
        }
    }

    /**
     * Moves the top card of the dynasty deck to the passed province
     * @param {String} location - one of 'province 1', 'province 2', 'province 3', 'province 4'
     */
    replaceDynastyCard(location) {
        if(this.dynastyDeck.size() === 0) {
            this.deckRanOutOfCards('dynasty');
        }
        this.moveCard(this.dynastyDeck.first(), location);
    }

    /**
     * Returns an Array of cards (upto to a max limit) in the conflict deck which match the passed predicate
     * @param {Int or Function} limit - lazy coding so you can pass just a predicate...
     * @param {Function} predicate - DrawCard => Boolean
     */
    searchConflictDeck(limit, predicate) {
        var cards = this.conflictDeck;

        if(_.isFunction(limit)) {
            predicate = limit;
        } else {
            if(limit > 0) {
                cards = _(this.conflictDeck.first(limit));
            } else {
                cards = _(this.conflictDeck.last(-limit));
            }
        }

        return cards.filter(predicate);
    }

    /**
     * Returns an Array of cards (upto to a max limit) in the dynasty deck which match the passed predicate
     * @param {Int or Function} limit - lazy coding so you can pass just a predicate...
     * @param {Function} predicate - DrawCard => Boolean
     */
    searchDynastyDeck(limit, predicate) {
        var cards = this.dynastyDeck;

        if(_.isFunction(limit)) {
            predicate = limit;
        } else {
            if(limit > 0) {
                cards = _(this.dynastyDeck.first(limit));
            } else {
                cards = _(this.dynastyDeck.last(-limit));
            }
        }

        return cards.filter(predicate);
    }

    /**
     * Shuffles the conflict deck, raising an event and displaying a message in chat
     */
    shuffleConflictDeck() {
        if(this.name !== 'Dummy Player') {
            this.game.addMessage('{0} is shuffling their conflict deck', this);
        }
        this.game.raiseEvent('onDeckShuffled', { player: this, deck: 'conflict deck' });
        this.conflictDeck = _(this.conflictDeck.shuffle());
    }

    /**
     * Shuffles the dynasty deck, raising an event and displaying a message in chat
     */
    shuffleDynastyDeck() {
        if(this.name !== 'Dummy Player') {
            this.game.addMessage('{0} is shuffling their dynasty deck', this);
        }
        this.game.raiseEvent('onDeckShuffled', { player: this, deck: 'dynasty deck' });
        this.dynastyDeck = _(this.dynastyDeck.shuffle());
    }


    /**
     * Discards a number of cards from the top of the conflict deck equal to the passed Int.  Calls the callback when finished.
     * @deprecated - there is no support for Game.playerDecked
     * @param {Int} number 
     * @param {Function} callback 
     */
    discardFromConflict(number, callback = () => true) {
        number = Math.min(number, this.conflictDeck.size());

        var cards = this.conflictDeck.first(number);
        this.discardCards(cards, false, discarded => {
            callback(discarded);
            if(this.conflictDeck.size() === 0) {
                this.game.playerDecked(this);
            }
        });
    }

    /**
     * Moves a card from the play area to the top of the relevant deck
     * @param {DrawCard} card 
     */
    moveCardToTopOfDeck(card) {
        this.game.raiseEvent('onCardLeavesPlay', { card: card, destination: card.isDynasty ? 'dynasty deck' : 'conflict deck'});
    }
    
    /**
     * Moves a card from the play area to the bottom of the relevant deck
     * @param {DrawCard} card 
     */
    moveCardToBottomOfDeck(card) {
        this.game.raiseEvent('onCardLeavesPlay', { card: card, destination: card.isDynasty ? 'dynasty deck bottom' : 'conflict deck bottom' });
    }

    /**
     * Moves the passed number of cards from the top of the conflict deck to the bottom
     * @param {Int} number 
     */
    moveFromTopToBottomOfConflictDrawDeck(number) {
        while(number > 0) {
            this.moveCard(this.conflictDeck.first(), 'conflict deck', { bottom: true });

            number--;
        }
    }

    /**
     * Discards the passed number of randomly chosen cards from this players hand, and displays a message in chat will all discarded cards
     * @param {Int} number 
     */
    discardAtRandom(number) {
        var toDiscard = Math.min(number, this.hand.size());
        var cards = [];

        while(cards.length < toDiscard) {
            var cardIndex = _.random(0, this.hand.size() - 1);

            var card = this.hand.value()[cardIndex];
            if(!cards.includes(card)) {
                cards.push(card);
            }
        }

        this.discardCardsFromHand(cards, true);
    }

    /**
     * Checks whether this player can initiate a conflict of the passed type
     * @param {String} conflictType - one of 'military', 'political'
     */
    canInitiateConflict(conflictType) {
        return (!this.conflicts.isAtMax(conflictType) &&
                this.conflicts.conflictOpportunities > 0);
    }

    /**
     * Increases the number of conflicts of the passed type that a player can initiate
     * @param {String} type - one of 'military', 'political'
     * @param {Int} number 
     */
    addConflict(type, number) {
        this.conflicts.modifyMaxForType(type, number);
    }

    setMaxConflict(number) {
        this.conflicts.setMax(number);
    }

    clearMaxConflict() {
        this.conflicts.clearMax();
    }

    setCannotInitiateConflictForType(type, value) {
        this.conflicts.setCannotInitiateForType(type, value);
    }

    initConflictDeck() {
        this.shuffleConflictDeck();
    }

    drawStartingHand() {
        this.drawCardsToHand(StartingHandSize);
    }

    initDynastyDeck() {
        this.shuffleDynastyDeck();
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
    }

    /**
     * Called when the Game object starts the game. Creates all cards on this players decklist, shuffles the decks and initialises player parameters for the start of the game
     */
    initialise() {
        this.prepareDecks();
        this.initConflictDeck();
        this.initDynastyDeck();

        this.fate = 0;
        this.honor = 0;
        this.readyToStart = false;
        this.limitedPlayed = 0;
        this.maxLimited = 1;
    }

    /**
     * Sets honor to the correct starting value
     */
    startGame() {
        if(!this.readyToStart) {
            return;
        }

        this.honor = this.stronghold.cardData.honor;
        //this.game.raiseEvent('onStatChanged', this, 'honor');
    }

    /**
     * Replaces the cards passed one for one in this players provinces, then shuffles the passed cards back into the deck,
     * and put a message in chat saying how many cards were replaced
     */
    dynastyMulligan(cards) {
        if(this.takenDynastyMulligan) {
            return false;
        }

        _.each(cards, card => this.moveCard(card, 'dynasty deck bottom'));
        this.takenDynastyMulligan = true;
        this.fillProvinces();
        this.shuffleDynastyDeck();
        this.game.addMessage('{0} has mulliganed {1} cards from the dynasty deck', this.name, cards.length);
    }

    /**
     * Display a message saying that this player has decided not to change any cards
     */
    dynastyKeep() {
        this.game.addMessage('{0} has kept all dynasty cards', this.name);
        this.takenDynastyMulligan = true;
    }

    /**
     * Draws one card for each card passed, then shuffles the passed cards back into the deck,
     * and put a message in chat saying how many cards were replaced
     */
    conflictMulligan(cards) {
        if(this.takenConflictMulligan) {
            return false;
        }

        _.each(['province 1', 'province 2', 'province 3', 'province 4'], location => {
            let card = this.getDynastyCardInProvince(location);
            if(card) {
                card.facedown = true;
            }
        });

        _.each(cards, card => {
            this.removeCardFromPile(card);
        });

        this.drawCardsToHand(cards.length);

        _.each(cards, card => {
            card.moveTo('conflict deck');
            this.conflictDeck.push(card);
        });

        this.shuffleConflictDeck();

        this.game.addMessage('{0} has mulliganed {1} cards from the conflict deck', this.name, cards.length);
        this.takenConflictMulligan = true;
        this.readyToStart = true;
    }

    /**
     * Display a message saying that this player has decided not to change any cards
     */
    conflictKeep() {
        _.each(['province 1', 'province 2', 'province 3', 'province 4'], location => {
            let card = this.getDynastyCardInProvince(location);
            if(card) {
                card.facedown = true;
            }
        });

        this.game.addMessage('{0} has kept all conflict cards', this.name);
        this.takenConflictMulligan = true;
        this.readyToStart = true;
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

        return limit.isAtMax();
    }

    /**
     * Marks the use of a max ability
     * @param {String} maxIdentifier 
     */
    incrementAbilityMax(maxIdentifier) {
        let limit = this.abilityMaxByIdentifier[maxIdentifier];

        if(limit) {
            limit.increment();
        }
    }

    /**
     * Called when a card is clicked.  Gets all actions for that card (including standard actions), checks to see how many of them meet
     * their requirements.  If only one does, calls that ability, if more than one do, creates a PlayActionPrompt
     * @param {BaseCard} card 
     */
    findAndUseAction(card) {
        if(!card) {
            return false;
        }

        var context = new AbilityContext({
            game: this.game,
            player: this,
            source: card
        });

        var actions = _.filter(card.getActions(), action => {
            context.ability = action;
            return action.meetsRequirements(context);
        });

        if(actions.length === 0) {
            return false;
        }

        if(actions.length === 1) {
            context.ability = actions[0];
            this.game.resolveAbility(context);
        } else {
            this.game.queueStep(new PlayActionPrompt(this.game, this, actions, context));
        }

        return true;
    }

    /**
     * Checks to see if a card can be put into play (in the current conflict). Checks for any other unique cards with the same title, and
     * for any relevant conflict restrictions
     * @param {DrawCard} card
     * @param {Boolean} inConflict
     */
    canPutIntoPlay(card, inConflict = false) {
        if(inConflict && card.allowGameAction('playIntoConflict') && (!this.game.currentConflict ||
                (this.isAttackingPlayer() && !card.allowGameAction('participateAsAttacker')) || 
                (this.isDefendingPlayer() && !card.allowGameAction('participateAsDefender')) || 
                card.conflictOptions.cannotParticipateIn[this.game.currentConflict.conflictType])) {
            return false;
        }
        
        if(!card.isUnique()) {
            return true;
        }

        return !_.any(this.game.getPlayers(), player => {
            return player.anyCardsInPlay(c => (
                c.name === card.name
                && (c.owner === this || c.controller === this)
                && c !== card
            ));
        });
    }

    /**
     * Puts one or more characters into play, calling the onCardEntersPlay and onCardPlayed events if necessary
     * @param {DrawCard} card - can also pass an Array of DrawCard
     * @param {Boolean} intoConflict 
     * @param {Boolean} raiseCardPlayed 
     */
    putIntoPlay(cards, intoConflict = false, raiseCardPlayed = false) {
        if(!_.isArray(cards)) {
            cards = [cards];
        }

        cards = _.filter(cards, card => this.canPutIntoPlay(card, intoConflict));
        if(cards.length === 0) {
            return;
        }

        let events = [];
        _.each(cards, card => {
            // this is deprecated, as this function should never be called for attachments, unless they get dragged into play
            if(card.getType() === 'attachment') {
                this.promptForAttachment(card);
                return;
            }

            let originalLocation = card.location;

            card.new = true;
            this.moveCard(card, 'play area');
            card.controller = this;

            if(intoConflict && this.game.currentConflict) {
                if(this.game.currentConflict.attackingPlayer === this) {
                    this.game.currentConflict.addAttacker(card);
                } else {
                    this.game.currentConflict.addDefender(card);
                }
            }

            events.push({
                name: 'onCardEntersPlay',
                params: { card: card, originalLocation: originalLocation }
            });

            if(raiseCardPlayed) {
                events.push({
                    name: 'onCardPlayed',
                    params: { player: this, card: card, originalLocation: originalLocation }
                });
            }
        });
    
        _.each(cards, card => card.applyPersistentEffects());

        this.game.raiseMultipleEvents(events);
    }

    /**
     * Called at the start of the setup phase
     */
    setupBegin() {
        this.firstPlayer = false;
        this.opponent = this.game.getOtherPlayer(this);
    }

    /**
     * Called after bids are finished in the draw phase.  Draws cards for this player equal to their modified bid
     */
    drawPhase() {
        this.drawPhaseCards = this.honorBid;
        this.game.addMessage('{0} draws {1} cards for the draw phase', this, this.drawPhaseCards);
        this.drawCardsToHand(this.drawPhaseCards);
    }

    /**
     * Called at the start of the Dynasty Phase.  Resets a lot of the single round parameters
     */
    beginDynasty() {
        this.roundDone = false;

        if(this.resetTimerAtEndOfRound) {
            this.noTimer = false;
        }

        this.conflicts.reset();

        this.conflictLimit = 0;
        this.drawPhaseCards = DrawPhaseCards;

        this.cardsInPlay.each(card => {
            card.new = false;
        });

        this.game.addFate(this, this.getTotalIncome());

        this.game.raiseEvent('onIncomeCollected', { player: this });

        this.passedDynasty = false;
        this.limitedPlayed = 0;
    }

    /**
     * Not really sure what purpose this serves, as attachments should never be in the cardsInPlay list
     */
    hasUnmappedAttachments() {
        return this.cardsInPlay.any(card => {
            return card.getType() === 'attachment';
        });
    }

    /**
     * Checks whether attaching passed attachment to passed card is legal
     * @param {DrawCard} attachment 
     * @param {DrawCard} card 
     */
    canAttach(attachment, card) {
        if(!attachment || !card) {
            return false;
        }

        return (
            card.location === 'play area' &&
            card !== attachment &&
            card.allowAttachment(attachment) &&
            attachment.canAttach(card)
        );
    }

    /**
     * Attaches passed attachment to passed card, transfering control if necessary, and raising relevant events
     * @param {DrawCard} attachment 
     * @param {DrawCard} card 
     * @param {Boolean} raiseCardPlayed 
     */
    attach(attachment, card, raiseCardPlayed = false) {
        if(!card || !attachment || !this.canPutIntoPlay(attachment)) {
            return;
        }

        let originalController = attachment.controller;
        attachment.controller = this;
        if(!this.canAttach(attachment, card)) {
            attachment.controller = originalController;
            return;
        }

        let originalLocation = attachment.location;
        let originalParent = attachment.parent;

        attachment.owner.removeCardFromPile(attachment);
        if(originalParent) {
            originalParent.removeAttachment(attachment);
        }
        attachment.moveTo('play area');
        card.attachments.push(attachment);
        attachment.parent = card;

        this.game.queueSimpleStep(() => {
            attachment.applyPersistentEffects();
            if(_.size(card.attachments.filter(c => c.isRestricted())) > 2) {
                this.game.promptForSelect(this, {
                    activePromptTitle: 'Choose a card to discard',
                    waitingPromptTitle: 'Waiting for opponent to choose a card to discard',
                    cardCondition: c => c.parent === card && c.isRestricted(),
                    onSelect: (player, card) => {
                        this.game.addMessage('{0} discards {1} from {2} due to too many Restricted attachments', player, card, card.parent);
                        player.discardCardFromPlay(card);
                        return true;
                    },
                    source: 'Too many Restricted attachments'
                });
            }
        });


        let events = [{
            name: 'onCardAttached',
            params: { card: attachment, parent: card }
        }];

        if(originalLocation !== 'play area') {
            events.push({
                name: 'onCardEntersPlay',
                params: { card: attachment, originalLocation: originalLocation }
            });
        }
        
        if(raiseCardPlayed) {
            events.push({
                name: 'onCardPlayed',
                params: { player: this, card: attachment, originalLocation: originalLocation }
            });
        }

        this.game.raiseMultipleEvents(events);
    }

    showConflictDeck() {
        this.showConflict = true;
    }

    showDynastyDeck() {
        this.showDynasty = true;
    }

    /**
     * Checks whether drag-dropping passed card from passed source to passed target is legal
     * @param {BaseCard} card 
     * @param {String} source 
     * @param {String} target 
     */
    isValidDropCombination(card, source, target) {
        if(!card) {
            return false;
        }

        let provinceLocations = ['stronghold province', 'province 1', 'province 2', 'province 3', 'province 4'];

        if(card.isProvince && target !== 'province deck') {
            if(!provinceLocations.includes(target) || this.getSourceList(target).any(card => card.isProvince)) {
                return false;
            }
        }

        if(target === 'province deck' && !card.isProvince) {
            return false;
        }

        return source !== target;
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

        if(!this.isValidDropCombination(card, source, target)) {
            return false;
        }


        if(!card) {
            if(source === 'play area') {
                var otherPlayer = this.game.getOtherPlayer(this);

                if(!otherPlayer) {
                    return false;
                }

                card = otherPlayer.findCardInPlayByUuid(cardId);

                if(!card) {
                    return false;
                }
            } else {
                return false;
            }
        }

        if(card.controller !== this) {
            return false;
        }

        if(target === 'play area' && card.getType() === 'event') {
            return false;
        }

        if(target === 'play area') {
            this.putIntoPlay(card);
        } else { // TODO: remove these or change them to discardCardFromPlay
            if(target === 'conflict discard pile') {
                this.discardCard(card, false);
                return true;
            }

            if(target === 'dynasty discard pile') {
                this.discardCard(card, false);
                return true;
            }

            this.moveCard(card, target);
        }

        return true;
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
     * Called a the start of a conflict
     */
    beginConflict() {
        this.cardsInPlay.each(card => {
            card.resetForConflict();
        });
    }

    /**
     * I don't think this is used currently.  Tracks that a conflict of the passed type has been initiated
     * @param {String} conflictType - one of 'military', 'political'
     */
    initiateConflict(conflictType) {
        this.conflicts.perform(conflictType);
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

    /**
     * Tracks that this player won a conflict of the passed type
     * @param {String} conflictType - one of 'military', 'political'
     * @param {Boolean} wasAttacker 
     */
    winConflict(conflictType, wasAttacker) {
        this.conflicts.won(conflictType, wasAttacker);
    }

    /**
     * Tracks that this player lost a conflict of the passed type
     * @param {String} conflictType - one of 'military', 'political'
     * @param {Boolean} wasAttacker 
     */
    loseConflict(conflictType, wasAttacker) {
        this.conflicts.lost(conflictType, wasAttacker);
    }

    resetForConflict() {
        this.cardsInPlay.each(card => {
            card.resetForConflict();
        });
    }

    /**
     * Moves a card from in play to the relavent discard pile, and raises the appropriate events
     * @param {DrawCard} card 
     */
    sacrificeCard(card) {
        if(card.allowGameAction('sacrifice')) {
            this.game.raiseEvent('onCardLeavesPlay', { card: card, destination: card.isDynasty ? 'dynasty discard pile' : 'conflict discard pile', isSacrifice: true });
        }
    }

    /**
     * Moves a card from in play to the relavent discard pile, and raises the appropriate events
     * @param {DrawCard} card 
     */
    discardCardFromPlay(card) {
        if(card.allowGameAction('discardCardFromPlay')) {
            this.game.raiseEvent('onCardLeavesPlay', { card: card, destination: card.isDynasty ? 'dynasty discard pile' : 'conflict discard pile' });
        }
    }

    /**
     * Moves the passed cards from this players hand to the relevant discard pile, raising the appropriate events
     * @param {Array of DrawCard} cards 
     * @param {Boolean} atRandom 
     */
    discardCardsFromHand(cards, atRandom = false) {
        let events = _.map(cards, card => {
            return {
                name: 'onDiscardFromHand',
                params: {
                    card: card,
                    player: this
                },
                handler: () => this.moveCard(card, card.isConflict ? 'conflict discard pile' : 'dynasty discard pile')
            };
        });
        this.game.raiseMultipleEvents(events, {
            name: 'onCardsDiscardedFromHand',
            params: {
                cards: cards,
                player: this
            },
            handler: () => this.game.addMessage('{0} discards {1}{2}', this, cards, atRandom ? ' at random' : '')
        });
    }

    discardCardFromHand(card) {
        this.discardCardsFromHand([card]);
    }

    /**
     * @deprecated
     * Use discardCardFromHand or discardCardFromPlay
     */
    discardCard(card, allowSave = true) {
        this.discardCards([card], allowSave);
    }

    /**
     * @deprecated
     * Use discardCardFromHand or discardCardFromPlay
     */
    discardCards(cards, allowSave = true, callback = () => true) {
        this.game.applyGameAction('discard', cards, cards => {
            var params = {
                player: this,
                cards: cards,
                allowSave: allowSave,
                originalLocation: cards[0].location
            };
            this.game.raiseEvent('onCardsDiscarded', params, event => {
                _.each(event.cards, card => {
                    this.doSingleCardDiscard(card, allowSave);
                });
                this.game.queueSimpleStep(() => {
                    callback(event.cards);
                });
            });
        });
    }

    /**
     * @deprecated
     * Use discardCardFromHand or discardCardFromPlay
     */
    doSingleCardDiscard(card, allowSave = true) {
        var params = {
            player: this,
            card: card,
            allowSave: allowSave,
            originalLocation: card.location
        };
        this.game.raiseEvent('onCardDiscarded', params, event => {
            if(event.card.isConflict) {
                this.moveCard(event.card, 'conflict discard pile');
            } else if(event.card.isDynasty) {
                this.moveCard(event.card, 'dynasty discard pile');
            }
            return { resolved: true, success: true };
        });
    }

    /**
     * Moves a card from the play area to this players hand, raising all relevant events
     * @param {DrawCard} card 
     */
    returnCardToHand(card) {
        if(card.allowGameAction('returnToHand')) {
            this.game.raiseEvent('onCardLeavesPlay', { card: card, destination: 'hand' });
        }
    }

    /**
     * Returns the total glory of all ready characters, and adds an amount equal to the number of claimed rings
     */
    getFavor() {
        var cardGlory = this.cardsInPlay.reduce((memo, card) => {
            if(!card.bowed && card.getType() === 'character' && card.contributesToFavor) {
                return memo + card.getGlory();
            }

            return memo;
        }, 0);

        this.cardsInPlay.each(card => {
            cardGlory = card.modifyFavor(this, cardGlory);
        });

        let rings = this.getClaimedRings();

        this.totalGloryForFavor = cardGlory + _.size(rings) + this.gloryModifier;

        return this.totalGloryForFavor;
    }

    changeGloryModifier(amount) {
        this.gloryModifier += amount;
    }

    /**
     * Returns an Array of Rings of all rings claimed by this player
     */
    getClaimedRings() {
        return _.filter(this.game.rings, ring => ring.claimedBy === this.name);
    }

    /**
     * Marks that this player controls the favor for the relevant conflict type
     * @param {String} conflictType 
     */
    claimImperialFavor() {
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
     * Readies all inplay cards for this player, excluding characters if that parameter is passed
     * @param {Boolean} notCharacters - this is not currently used
     */
    readyCards(notCharacters = false) {
        this.cardsInPlay.each(card => {
            card.attachments.each(attachment => {
                this.readyCard(attachment);
            });

            if((notCharacters && card.getType() === 'character') || !card.readysDuringReadying) {
                return;
            }

            this.readyCard(card);
        });

        this.stronghold.bowed = false;
    }

    /**
     * Moves an attachment from a character in play to the discard
     * @param {*} attachment 
     */
    removeAttachment(attachment) {
        this.game.raiseEvent('onCardLeavesPlay', { card: attachment, destination: 'conflict discard pile' });
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

        if(!targetPile || targetPile.contains(card)) {
            return;
        }

        let location = card.location;

        if(location === 'play area' || (card.type === 'holding' && ['province 1', 'province 2', 'province 3', 'province 4'].includes(location))) {
            if(card.owner !== this) {
                card.owner.moveCard(card, targetLocation, options);
                return;
            }

            if(card.isConflict || card.isDynasty) {
                // In normal play, all attachments should already have been removed, but in manual play we may need to remove them.
                // This is also used by Back-Alley Hideaway when it is sacrificed. This won't trigger any leaves play effects
                card.attachments.each(attachment => {
                    attachment.leavesPlay();
                    attachment.owner.moveCard(attachment, attachment.isDynasty ? 'dynasty discard pile' : 'conflict discard pile');
                });
            }

            card.leavesPlay();

            card.moveTo(targetLocation);
        } else {
            if(targetLocation === 'play area') {
                card.controller = this;
            } else {
                card.controller = card.owner;
            }
            card.moveTo(targetLocation);
        }

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
        } else if(['conflict discard pile', 'dynasty discard pile'].includes(targetLocation)) {
            // new cards go on the top of the discard pile
            targetPile.unshift(card);
        } else {
            targetPile.push(card);
        }

        if(['conflict discard pile', 'dynasty discard pile'].includes(targetLocation)) {
            this.game.raiseEvent('onCardPlaced', { card: card, location: targetLocation });
        }

        // Replace a card which has been played, put into play or discarded from a province
        if(card.isDynasty && ['province 1', 'province 2', 'province 3', 'province 4'].includes(location) && targetLocation !== 'dynasty deck') {
            this.replaceDynastyCard(location);
        }
    }
    
    /**
     * Raises an event for breaking a province, checks to see if the breaking player wants to discard the card in the province, and checks conquer victory condition
     * @param {ProvinceCard} province 
     */
    breakProvince(province) {
        if(!province.allowGameAction('break')) {
            return;
        }
        this.game.raiseEvent('onBreakProvince', { conflict: this.game.currentConflict, province: province }, () => {
            province.breakProvince();
            this.game.reapplyStateDependentEffects();
            if(province.controller.opponent) {
                this.game.addMessage('{0} has broken {1}!', province.controller.opponent, province);
                if(province.location === 'stronghold province') {
                    this.game.recordWinner(province.controller.opponent, 'conquest');
                } else {
                    let dynastyCard = province.controller.getDynastyCardInProvince(province.location);
                    if(dynastyCard) {
                        let promptTitle = 'Do you wish to discard ' + (dynastyCard.facedown ? 'the facedown card' : dynastyCard.name) + '?';
                        this.game.promptWithHandlerMenu(province.controller.opponent, {
                            activePromptTitle: promptTitle,
                            source: 'Break ' + province.name,
                            choices: ['Yes', 'No'],
                            handlers: [
                                () => {
                                    this.game.addMessage('{0} chooses to discard {1}', province.controller.opponent, dynastyCard.facedown ? 'the facedown card' : dynastyCard);
                                    province.controller.moveCard(dynastyCard, 'dynasty discard pile');
                                },
                                () => this.game.addMessage('{0} chooses not to discard {1}', province.controller.opponent, dynastyCard.facedown ? 'the facedown card' : dynastyCard)
                            ]
                        });
                    }
                }
            }
            return { resolved: true, success: true };
        });
    }

    /**
     * Raises an event for an effect honoring a card
     * @param {DrawCard} card 
     * @param {EffectSource} source 
     */
    honorCard(card, source) {
        this.game.raiseEvent('onCardHonored', { player: this, card: card, source: source }, () => {
            return { resolved: true, success: card.honor() };
        });
    }

    /**
     * Raises an event for an effect dishonoring a card
     * @param {DrawCard} card 
     * @param {EffectSource} source 
     */
    dishonorCard(card, source) {
        this.game.raiseEvent('onCardDishonored', { player: this, card: card, source: source }, () => {
            return { resolved: true, result: card.dishonor() };
        });
    }

    /**
     * Raises an event for an effect bowing a card
     * @param {DrawCard} card 
     * @param {EffectSource} source 
     */
    bowCard(card, source) {
        if(card.bowed) {
            return;
        }

        this.game.applyGameAction('bow', card, card => {
            card.bowed = true;

            this.game.raiseEvent('onCardBowed', { player: this, card: card, source: source });
        });
    }

    /**
     * Bows multiple cards
     * @param {[DrawCard]} cards
     * @param {EffectSource} source
     */
    bowCards(cards, source) {
        _.each(cards, card => this.bowCard(card, source));
    }

    /**
     * Raises an event for an effect readying a card
     * @param {DrawCard} card 
     * @param {EffectSource} source 
     */
    readyCard(card, source) {
        if(!card.bowed) {
            return;
        }

        this.game.applyGameAction('ready', card, card => {
            card.bowed = false;

            this.game.raiseEvent('onCardStood', { player: this, card: card, source: source });
        });
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
     * @param {Array of BaseCard} cards 
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

    getSummaryForCardList(list, activePlayer, hideWhenFaceup) {
        return list.map(card => {
            return card.getSummary(activePlayer, hideWhenFaceup);
        });
    }

    getCardSelectionState(card) {
        return this.promptState.getCardSelectionState(card);
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

    /**
     * Resolves any number of ring effects.  If there are more than one, then it will prompt the first player to choose what order those effects should be applied in
     * @param {Array} elements - Array of String, alternatively can be passed a String for convenience
     * @param {Boolean} optional - Indicates that the player can choose which effects to resolve.  This parameter only effects resolution of a single effect
     * @param {Array} queue - Array of String, used in the chat message displaying order
     */
    resolveRingEffects(elements, optional = false, queue = []) {
        if(!_.isArray(elements)) {
            this.game.resolveAbility(RingEffects.contextFor(this, elements, optional));
            return;
        } else if(elements.length === 1) {
            queue.push(elements[0]);
            if(queue.length > 1) {
                this.game.addMessage('{0} chooses that the rings will resolve in the following order: {1}', this.game.getFirstPlayer(), queue);
            }
            _.each(queue, element => this.game.queueSimpleStep(() => this.game.resolveAbility(RingEffects.contextFor(this, element, false))));
            return;
        } 
        let handlers = _.map(elements, element => {
            return () => {
                queue.push(element);
                this.game.queueSimpleStep(() => this.resolveRingEffects(_.without(elements, element), false, queue));
            };
        });
        let choices = _.map(elements, element => RingEffects.getRingName(element));
        this.game.promptWithHandlerMenu(this.game.getFirstPlayer(), {
            activePromptTitle: 'Choose ring resolution order',
            source: 'Ring resolution order',
            choices: choices,
            handlers: handlers
        });
    }

    /**
     * Prompts the player to choose a character with no fate until all such characters have been discarded (or the discard prevented)
     * @param {Array} cardsToDiscard - Array of DrawCard
     */
    discardCharactersWithNoFate(cardsToDiscard) {
        if(cardsToDiscard.length === 0) {
            return;
        }
        this.game.promptForSelect(this, {
            source: 'Fate Phase',
            activePromptTitle: 'Choose character to discard\n(or click Done to discard all characters with no fate)',
            waitingPromptTitle: 'Waiting for opponent to discard characters with no fate',
            cardCondition: card => cardsToDiscard.includes(card),
            cardType: 'character',
            onSelect: (player, card) => {
                player.discardCardFromPlay(card);
                this.game.queueSimpleStep(() => player.discardCharactersWithNoFate(_.reject(cardsToDiscard, c => c === card)));
                return true;
            },
            onCancel: () => {
                _.each(cardsToDiscard, character => {
                    this.discardCardFromPlay(character);
                });
                return true;
            }
        });
    }

    getStats() {
        return {
            fate: this.fate,
            honor: this.getTotalHonor(),
            conflictsRemaining: this.conflicts.conflictOpportunities,
            militaryRemaining: !this.conflicts.isAtMax('military'),
            politicalRemaining: !this.conflicts.isAtMax('political')
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
                /* outOfGamePile: this.getSummaryForCardList(this.outOfGamePile, activePlayer, false), */
                provinceDeck: this.getSummaryForCardList(this.provinceDeck, activePlayer, true)
            },
            conflictDeckTopCardHidden: this.conflictDeckTopCardHidden,
            disconnected: this.disconnected,
            faction: this.faction,
            firstPlayer: this.firstPlayer,
            id: this.id,
            optionSettings: this.optionSettings,
            imperialFavor: this.imperialFavor,
            left: this.left,
            name: this.name,
            numConflictCards: this.conflictDeck.size(),
            numDynastyCards: this.dynastyDeck.size(),
            numProvinceCards: this.provinceDeck.size(),
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
            strongholdProvince: this.getSummaryForCardList(this.strongholdProvince, activePlayer),
            timerSettings: this.timerSettings,
            user: _.omit(this.user, ['password', 'email'])
        };

        if(this.showConflictDeck) {
            state.showConflictDeck = true;
            state.cardPiles.conflictDeck = this.getSummaryForCardList(this.conflictDeck, activePlayer);
        }

        if(this.showDynastyDeck) {
            state.showDynastyDeck = true;
            state.cardPiles.dynastyDeck = this.getSummaryForCardList(this.dynastyDeck, activePlayer);
        }

        if(this.role) {
            state.role = this.role.getSummary(activePlayer);
        }
        
        if(this.stronghold) {
            state.stronghold = this.stronghold.getSummary(activePlayer);
        }

        return _.extend(state, promptState);
    }
}

module.exports = Player;
