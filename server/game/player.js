const _ = require('underscore');

const GameObject = require('./GameObject');
const Deck = require('./deck.js');
const AttachmentPrompt = require('./gamesteps/attachmentprompt.js');
const ClockSelector = require('./Clocks/ClockSelector');
const CostReducer = require('./costreducer.js');
const GameActions = require('./GameActions/GameActions');
const RingEffects = require('./RingEffects.js');
const PlayableLocation = require('./playablelocation.js');
const PlayerPromptState = require('./playerpromptstate.js');
const RoleCard = require('./rolecard.js');
const StrongholdCard = require('./strongholdcard.js');

const provinceLocations = ['stronghold province', 'province 1', 'province 2', 'province 3', 'province 4'];

class Player extends GameObject {
    constructor(id, user, owner, game, clockdetails) {
        super(game, user.username);
        this.user = user;
        this.emailHash = this.user.emailHash;
        this.id = id;
        this.owner = owner;
        this.type = 'player';

        this.hand = [];
        this.cardsInPlay = []; // This stores references to all creatures and artifacts in play.  Upgrades are not stored here.
        this.deck = [];
        this.discard = [];
        this.purged = [];
        this.archives = [];

        this.houses = [];
        this.activeHouse = null;

        this.deckData = {};
        this.takenMulligan = false;

        this.clock = ClockSelector.for(this, clockdetails);

        this.playableLocations = [
            new PlayableLocation('play', this, 'hand'),
        ];
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
        list = list.filter(card => card.uuid !== uuid);
        return list;
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
     * Checks whether the passes card is in a legal location for the passed type of play
     * @param {BaseCard} card
     * @param {String} playingType
     */
    isCardInPlayableLocation(card, playingType) {
        return _.any(this.playableLocations, location => location.playingType === playingType && location.contains(card));
    }

    /**
     * Draws the passed number of cards from the top of the conflict deck into this players hand, shuffling and deducting honor if necessary
     * @param {number} numCards
     */
    drawCardsToHand(numCards) {
        let remainingCards = 0;

        if(numCards > this.deck.length) {
            remainingCards = numCards - this.deck.length;
            numCards = this.deck.length;
        }

        for(let card of this.deck.slice(0, numCards)) {
            this.moveCard(card, 'hand');
        }

        if(remainingCards > 0) {
            this.deckRanOutOfCards();
            this.game.queueSimpleStep(() => this.drawCardsToHand(remainingCards));
        }
    }

    /**
     * Called when one of the players decks runs out of cards, removing 5 honor and shuffling the discard pile back into the deck
     * @param {String} deck - one of 'conflict' or 'dynasty'
     */
    deckRanOutOfCards(deck) {
        this.game.addMessage('{0}\'s deck has run out of cards, so they shuffle', this, deck);
        for(let card of this.discard) {
            this.moveCard(card, 'deck');
        }
        this.shuffleDeck();
    }

    /**
     * Shuffles the conflict deck, emitting an event and displaying a message in chat
     */
    shuffleDeck() {
        if(this.name !== 'Dummy Player') {
            this.game.addMessage('{0} is shuffling their conflict deck', this);
        }
        this.game.emitEvent('onDeckShuffled', { player: this });
        this.deck = _.shuffle(this.deck);
    }

    /**
     * Takes a decklist passed from the lobby, creates all the cards in it, and puts references to them in the relevant lists
     */
    prepareDecks() {
        let deck = new Deck(this.deckData);
        var preparedDeck = deck.prepare(this);
        this.houses = preparedDeck.houses;
        this.deck = preparedDeck.cards;
    }

    /**
     * Called when the Game object starts the game. Creates all cards on this players decklist, shuffles the decks and initialises player parameters for the start of the game
     */
    initialise() {
        this.prepareDecks();
        this.shuffleDeck();

        this.keys = 0;
        this.amber = 0;
        this.readyToStart = false;
        this.opponent = this.game.getOtherPlayer(this);
    }

    addPlayableLocation(type, player, location) {
        let playableLocation = new PlayableLocation(type, player, location);
        this.playableLocations.push(playableLocation);
        return playableLocation;
    }

    removePlayableLocation(location) {
        this.playableLocations = _.reject(this.playableLocations, l => l === location);
    }

    /**
     * Called at the start of the Dynasty Phase.  Resets a lot of the single round parameters
     */
    beginRound() {
        for(let card of this.cardsInPlay) {
            card.new = false;
        }
    }

    showDeck() {
        this.deck = true;
    }

    showDynastyDeck() {
        this.showDynasty = true;
    }

    /**
     * Gets the appropriate list for the passed location
     * @param {String} source
     */
    getSourceList(source) {
        if(source === 'play area') {
            return this.cardsInPlay;
        }
        return this[source];
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

        let display = 'a card';
        if(!card.facedown && source !== 'hand' || ['play area', 'discard', 'purged'].includes(target)) {
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

        const cardLocations = ['hand', 'deck', 'discard', 'archives', 'purged'];
        const legalLocations = {
            artifact: [...cardLocations, 'play area'],
            action: [...cardLocations, 'being played'],
            creature: [...cardLocations, 'play area'],
            upgrade: [...cardLocations, 'play area']
        };

        return legalLocations[card.type] && legalLocations[card.type].includes(location);
    }

    /**
     * Called by the game when the game starts, sets the players decklist
     * @param {*} deckData
     */
    selectDeck(deckData) {
        this.deckData.selected = false;
        this.deckData = deckData;
        this.deckData.selected = true;
        this.houses = deckData.houses;
    }

    /**
     * Moves a card from one location to another. This involves removing in from the list it's currently in, calling DrawCard.move (which changes
     * its location property), and then adding it to the list it should now be in
     * @param {Card} card
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

        if(location === 'play area') {
            if(card.owner !== this) {
                card.owner.moveCard(card, targetLocation, options);
                return;
            }

            // In normal play, all attachments should already have been removed, but in manual play we may need to remove them.
            // This is also used by Back-Alley Hideaway when it is sacrificed. This won't trigger any leaves play effects
            card.upgrades.each(upgrade => {
                upgrade.leavesPlay();
                upgrade.owner.moveCard(upgrade, 'discard');
            });

            card.leavesPlay();
            card.controller = this;
        } else if(targetLocation === 'play area') {
            card.setDefaultController(this);
            card.controller = this;
        } else if(location === 'being played' && card.owner !== this) {
            card.owner.moveCard(card, targetLocation, options);
            return;
        } else {
            card.controller = card.owner;
        }

        card.moveTo(targetLocation);

        if(['deck', 'play area'].includes(targetLocation) && !options.bottom) {
            targetPile.unshift(card);
        } else if(['discard', 'purged'].includes(targetLocation)) {
            // new cards go on the top of the discard pile
            targetPile.unshift(card);
        } else if(targetPile) {
            targetPile.push(card);
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
        }
    }

    /**
     * Sets the passed cards as selected
     * @param {Card[]} cards
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

    isTopCardShown() {
        return this.anyEffect('showTopConflictCard');
    }

    getAvailableHouses() {
        return this.houses;
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
                archives: this.getSummaryForCardList(this.archives, activePlayer),
                cardsInPlay: this.getSummaryForCardList(this.cardsInPlay, activePlayer),
                discard: this.getSummaryForCardList(this.discard, activePlayer),
                hand: this.getSummaryForCardList(this.hand, activePlayer, true),
                purged: this.getSummaryForCardList(this.purged, activePlayer)
            },
            disconnected: this.disconnected,
            houses: this.houses,
            id: this.id,
            left: this.left,
            name: this.name,
            numDeckCards: this.deck.length,
            optionSettings: this.optionSettings,
            phase: this.game.currentPhase,
            stats: this.getStats(),
            user: _.omit(this.user, ['password', 'email'])
        };

        if(this.showDeck) {
            state.showDeck = true;
            state.cardPiles.deck = this.getSummaryForCardList(this.deck, activePlayer, true),
        }

        if(this.isTopCardShown()) {
            state.deckTopCard = this.deck[0].getSummary(activePlayer);
        }

        if(this.clock) {
            state.clock = this.clock.getState();
        }

        return _.extend(state, promptState);
    }
}

module.exports = Player;
