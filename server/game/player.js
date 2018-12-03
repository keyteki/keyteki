const _ = require('underscore');

const GameObject = require('./GameObject');
const Deck = require('./deck.js');
const ClockSelector = require('./Clocks/ClockSelector');
const PlayableLocation = require('./playablelocation.js');
const PlayerPromptState = require('./playerpromptstate.js');

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

        this.chains = 0;
        this.keyForged = false;

        this.clock = ClockSelector.for(this, clockdetails);
        this.showDeck = false;

        this.playableLocations = [
            new PlayableLocation('play', this, 'hand')
        ];
        this.optionSettings = user.settings.optionSettings;

        this.promptState = new PlayerPromptState(this);
    }

    isSpectator() {
        return false;
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
     * Checks whether a card with a uuid matching the passed card is in the passed Array
     * @param {Array} list
     * @param card
     */
    isCardUuidInList(list, card) {
        return list.some(c => {
            return c.uuid === card.uuid;
        });
    }

    /**
     * Checks whether a card with a name matching the passed card is in the passed list
     * @param {Array} list
     * @param card
     */
    isCardNameInList(list, card) {
        return list.some(c => {
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
     * Removes a card with the passed uuid from a list. Returns an Array
     * @param list
     * @param {String} uuid
     */
    removeCardByUuid(list, uuid) {
        list = list.filter(card => card.uuid !== uuid);
        return list;
    }

    /**
     * Returns an Array of all characters and upgrades matching the predicate controlled by this player
     * @param {Function} predicate  - DrawCard => Boolean
     */
    filterCardsInPlay(predicate) {
        return this.game.allCards.filter(card => card.controller === this && card.location === 'play area' && predicate(card));
    }

    /**
     * Returns the total number of characters and upgrades controlled by this player which match the passed predicate
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
     * @param card
     * @param {String} playingType
     */
    isCardInPlayableLocation(card, playingType) {
        return _.any(this.playableLocations, location => location.playingType === playingType && location.contains(card));
    }

    get creaturesInPlay() {
        return this.cardsInPlay.filter(card => card.type === 'creature');
    }

    /**
     * Draws the passed number of cards from the top of the deck into this players hand, shuffling if necessary
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

        if(remainingCards > 0 && this.discard.length > 0) {
            this.deckRanOutOfCards();
            this.game.queueSimpleStep(() => this.drawCardsToHand(remainingCards));
        }
    }

    /**
     * Called when one of the players decks runs out of cards, removing 5 honor and shuffling the discard pile back into the deck
     */
    deckRanOutOfCards() {
        this.game.addMessage('{0}\'s deck has run out of cards, so they shuffle', this);
        for(let card of this.discard) {
            this.moveCard(card, 'deck');
        }
        this.shuffleDeck();
    }

    /**
     * Shuffles the deck, emitting an event and displaying a message in chat
     */
    shuffleDeck() {
        if(this.name !== 'Dummy Player') {
            this.game.addMessage('{0} is shuffling their deck', this);
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
        this.allCards = preparedDeck.cards;
    }

    /**
     * Called when the Game object starts the game. Creates all cards on this players decklist, shuffles the decks and initialises player parameters for the start of the game
     */
    initialise() {
        this.prepareDecks();
        this.shuffleDeck();

        this.keys = 0;
        this.amber = 0;
        this.turn = 1;
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

    endRound() {
        for(let card of this.cardsInPlay) {
            card.new = false;
        }
        this.turn += 1;
        if(this.opponent) {
            this.opponent.keyForged = false;
        }
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
        var card = sourceList.find(card => card.uuid === cardId);

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
     * @param card
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
     * @param card
     * @param {String} targetLocation
     * @param {Object} options
     */
    moveCard(card, targetLocation, options = {}) {

        if(targetLocation.endsWith(' bottom')) {
            options.bottom = true;
            targetLocation = targetLocation.replace(' bottom', '');
        }

        var targetPile = this.getSourceList(targetLocation);

        if(!this.isLegalLocationForCard(card, targetLocation) || targetPile && targetPile.includes(card)) {
            return;
        }

        this.removeCardFromPile(card);
        let location = card.location;

        if(location === 'play area') {
            if(targetLocation !== 'archives' && card.owner !== this) {
                card.owner.moveCard(card, targetLocation, options);
                return;
            }

            for(let upgrade of card.upgrades) {
                upgrade.onLeavesPlay();
                upgrade.owner.moveCard(upgrade, 'discard');
            }

            for(let child of card.childCards) {
                child.onLeavesPlay();
                child.owner.moveCard(child, 'discard');
            }

            card.onLeavesPlay();
            card.controller = this;
        } else if(targetLocation === 'play area') {
            if(options.myControl) {
                card.setDefaultController(this);
            }
            card.exhausted = true;
        } else if(card.owner !== this) {
            card.owner.moveCard(card, targetLocation, options);
            return;
        } else {
            card.controller = card.owner;
        }

        card.moveTo(targetLocation);

        if(targetLocation === 'deck' && !options.bottom) {
            targetPile.unshift(card);
        } else if(['discard', 'purged'].includes(targetLocation)) {
            // new cards go on the top of the discard pile
            targetPile.unshift(card);
        } else if(targetLocation === 'play area' && options.left) {
            targetPile.unshift(card);
        } else if(targetPile) {
            targetPile.push(card);
        }

        this.game.raiseEvent('onCardPlaced', { card: card, from: location, to: targetLocation });
    }

    /**
     * Removes a card from whichever list it's currently in
     * @param card
     */
    removeCardFromPile(card) {
        if(card.parent) {
            if(card.parent.upgrades.includes(card)) {
                card.parent.upgrades = card.parent.upgrades.filter(c => c !== card);
            } else if(card.parent.childCards.includes(card)) {
                card.parent.childCards = card.parent.childCards.filter(c => c !== card);
            }
            card.parent = null;
            return;
        }

        if(card.controller !== this) {
            card.controller.removeCardFromPile(card);
            return;
        }

        if(card.location === 'play area') {
            this.cardsInPlay = this.cardsInPlay.filter(c => c !== card);
        } else if(this[card.location]) {
            this[card.location] = this[card.location].filter(c => c !== card);
        }
    }

    /**
     * Sets the passed cards as selected
     * @param cards
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

    modifyAmber(amount) {
        this.amber = Math.max(this.amber + amount, 0);
    }

    modifyChains(amount) {
        this.chains = Math.max(this.chains + amount, 0);
    }

    get maxHandSize() {
        return 6 + this.sumEffects('modifyHandSize') - Math.floor((this.chains + 5) / 6);
    }

    getAvailableHouses() {
        let availableHouses = this.cardsInPlay.reduce((houses, card) => {
            if(!houses.includes(card.printedHouse)) {
                return houses.concat(card.printedHouse);
            }
            return houses;
        }, this.houses);
        if(this.anyEffect('restrictHouseChoice')) {
            availableHouses = [].concat(...this.getEffects('restrictHouseChoice'));
        }
        availableHouses = _.difference(availableHouses, this.getEffects('stopHouseChoice'));
        return availableHouses;
    }

    canIgnoreHouseRestrictions(card, context) {
        return this.getEffects('canUse').some(match => match(card, context));
    }

    canForgeKey(modifier = 0) {
        let alternativeSources = this.getEffects('keyAmber').reduce((total, source) => total + source.tokens.amber ? source.tokens.amber : 0, 0);
        return this.amber + alternativeSources >= this.getCurrentKeyCost() + modifier;
    }

    getCurrentKeyCost() {
        return this.sumEffects('modifyKeyCost') + 6;
    }

    forgeKey(modifier) {
        let cost = Math.max(0, this.getCurrentKeyCost() + modifier);
        let modifiedCost = cost;
        if(this.anyEffect('keyAmber')) {
            let totalAvailable = this.getEffects('keyAmber').reduce((total, source) => total + source.tokens.amber ? source.tokens.amber : 0, 0);
            for(let source of this.getEffects('keyAmber').filter(source => source.hasToken('amber'))) {
                this.game.queueSimpleStep(() => {
                    let max = Math.min(modifiedCost, source.tokens.amber);
                    let min = Math.max(0, modifiedCost - this.amber - totalAvailable + source.tokens.amber);
                    this.game.promptWithHandlerMenu(this, {
                        activePromptTitle: 'How much amber do you want to use from ' + source.name,
                        source: 'Forge a Key',
                        choices: _.range(min, max + 1),
                        choiceHandler: choice => {
                            modifiedCost -= choice,
                            source.removeToken('amber', choice);
                        }
                    });
                });
            }
        }
        this.game.queueSimpleStep(() => {
            this.modifyAmber(-modifiedCost);
            if(this.anyEffect('forgeAmberGainedByOpponent')) {
                this.game.actions.gainAmber({ amount: cost }).resolve(this.opponent, this.game.getFrameworkContext());
            }
            this.keys += 1;
            this.keyForged = true;
        });
    }

    getAdditionalCosts(context) {
        return this.getEffects('additionalCost').reduce((array, costFactory) => array.concat(costFactory(context)), []).filter(cost => !!cost);
    }

    getStats() {
        return {
            amber: this.amber,
            chains: this.chains,
            keys: this.keys,
            houses: this.houses
        };
    }

    getRingSelectionState(ring) {
        return this.promptState.getRingSelectionState(ring);
    }

    /**
     * This information is passed to the UI
     * @param {Player} activePlayer
     */

    getState(activePlayer) {
        /*
        let isActivePlayer = activePlayer === this;
        let promptState = isActivePlayer ? this.promptState.getState() : {};
        let state = {
            activeHouse: this.activeHouse,
            cardback: this.deckData.cardback,
            cardPiles: {
                cardsInPlay: this.getSummaryForCardList(this.cardsInPlay, activePlayer),
                dynastyDiscardPile: this.getSummaryForCardList(this.discard, activePlayer),
                hand: this.getSummaryForCardList(this.hand, activePlayer, true),
                removedFromGame: this.getSummaryForCardList(this.purged, activePlayer)
            },
            disconnected: this.disconnected,
            faction: '',
            firstPlayer: false,
            houses: this.houses,
            hideProvinceDeck: true,
            id: this.id,
            imperialFavor: '',
            left: this.left,
            name: this.name,
            numConflictCards: this.archives.length,
            numDynastyCards: this.deck.length,
            optionSettings: this.optionSettings,
            phase: this.game.currentPhase,
            promptedActionWindows: { // these flags represent phase settings
                dynasty: true,
                draw: true,
                preConflict: true,
                conflict: true,
                fate: true,
                regroup: true
            },
            provinces: {
                one: this.getSummaryForCardList([], activePlayer, !this.readyToStart),
                two: this.getSummaryForCardList([], activePlayer, !this.readyToStart),
                three: this.getSummaryForCardList([], activePlayer, !this.readyToStart),
                four: this.getSummaryForCardList([], activePlayer, !this.readyToStart)
            },
            showBid: 0,
            stats: this.getStats(),
            strongholdProvince: this.getSummaryForCardList([], activePlayer),
            user: _.omit(this.user, ['password', 'email'])
        };

        if(this.clock) {
            state.clock = this.clock.getState();
        }
        */

        let isActivePlayer = activePlayer === this;
        let promptState = isActivePlayer ? this.promptState.getState() : {};
        let state = {
            activeHouse: this.activeHouse,
            cardPiles: {
                archives: this.getSummaryForCardList(this.archives, activePlayer, true),
                cardsInPlay: this.getSummaryForCardList(this.cardsInPlay, activePlayer),
                discard: this.getSummaryForCardList(this.discard, activePlayer),
                hand: this.getSummaryForCardList(this.hand, activePlayer, true),
                purged: this.getSummaryForCardList(this.purged, activePlayer)
            },
            cardback: 'cardback',
            deckName: this.deckData.name,
            deckUuid: this.deckData,
            //cardback: this.deckData.cardback,
            disconnected: this.disconnected,
            activePlayer: this.game.activePlayer === this,
            houses: this.houses,
            id: this.id,
            left: this.left,
            name: this.name,
            numDeckCards: this.deck.length,
            numArchivesCards: this.archives.length,
            optionSettings: this.optionSettings,
            phase: this.game.currentPhase,
            stats: this.getStats(),
            timerSettings: {},
            user: _.omit(this.user, ['password', 'email'])
        };

        if(isActivePlayer) {
            let sortedDeck = this.deck.slice();
            sortedDeck.sort((a, b) => {
                if(a.printedHouse < b.printedHouse) {
                    return -1;
                } else if(a.printedHouse > b.printedHouse) {
                    return 1;
                } else if(a.id < b.id) {
                    return -1;
                } else if(a.id > b.id) {
                    return 1;
                }
                return 0;
            });
            state.cardPiles.deck = this.getSummaryForCardList(sortedDeck, activePlayer, true);
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
