const _ = require('underscore');

const GameObject = require('./GameObject');
const Deck = require('./deck');
const ClockSelector = require('./Clocks/ClockSelector');
const PlayableLocation = require('./playablelocation');
const PlayerPromptState = require('./playerpromptstate');

class Player extends GameObject {
    constructor(id, user, owner, game, clockdetails) {
        super(game);
        this.user = user;
        this.emailHash = this.user.emailHash;
        this.id = id;
        this.owner = owner;

        this.hand = [];
        this.cardsInPlay = []; // This stores references to all creatures and artifacts in play.  Upgrades are not stored here.
        this.deckCards = [];
        this.discard = [];
        this.purged = [];
        this.archives = [];
        this.wins = 0;

        this.houses = [];
        this.activeHouse = null;

        this.deckData = {};
        this.takenMulligan = false;

        this.chains = 0;
        this.keysForgedThisRound = [];

        this.clock = ClockSelector.for(this, clockdetails);
        this.showDeck = false;
        this.role = user.role;
        this.avatar = user.avatar;

        this.playableLocations = [new PlayableLocation('play', this, 'hand')];
        this.optionSettings = user.settings.optionSettings;

        this.promptState = new PlayerPromptState(this);
    }

    get name() {
        return this.user.username;
    }

    get type() {
        return 'player';
    }

    isSpectator() {
        return false;
    }

    startClock() {
        this.clock.start();
        if (this.opponent) {
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
        return list.some((c) => {
            return c.uuid === card.uuid;
        });
    }

    /**
     * Checks whether a card with a name matching the passed card is in the passed list
     * @param {Array} list
     * @param card
     */
    isCardNameInList(list, card) {
        return list.some((c) => {
            return c.name === card.name;
        });
    }

    /**
     * Checks whether any cards in play are currently marked as selected
     */
    areCardsSelected() {
        return this.cardsInPlay.any((card) => {
            return card.selected;
        });
    }

    /**
     * Removes a card with the passed uuid from a list. Returns an Array
     * @param list
     * @param {String} uuid
     */
    removeCardByUuid(list, uuid) {
        list = list.filter((card) => card.uuid !== uuid);
        return list;
    }

    /**
     * Returns an Array of all characters and upgrades matching the predicate controlled by this player
     * @param {Function} predicate  - DrawCard => Boolean
     */
    filterCardsInPlay(predicate) {
        return this.game.allCards.filter(
            (card) => card.controller === this && card.location === 'play area' && predicate(card)
        );
    }

    /**
     * Returns the total number of characters and upgrades controlled by this player which match the passed predicate
     * @param {Function} predicate - DrawCard => Int
     */
    getNumberOfCardsInPlay(predicate) {
        return this.game.allCards.reduce((num, card) => {
            if (card.controller === this && card.location === 'play area' && predicate(card)) {
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
        return _.any(
            this.playableLocations,
            (location) => location.playingType === playingType && location.contains(card)
        );
    }

    get creaturesInPlay() {
        return this.cardsInPlay.filter((card) => card.type === 'creature');
    }

    /**
     * Draws the passed number of cards from the top of the deck into this players hand, shuffling if necessary
     * @param {number} numCards
     */
    drawCardsToHand(numCards) {
        let remainingCards = 0;

        if (numCards > this.deck.length) {
            remainingCards = numCards - this.deck.length;
            numCards = this.deck.length;
        }

        for (let card of this.deck.slice(0, numCards)) {
            this.moveCard(card, 'hand');
        }

        if (remainingCards > 0 && this.discard.length > 0) {
            this.deckRanOutOfCards();
            this.game.queueSimpleStep(() => this.drawCardsToHand(remainingCards));
        }
    }

    /**
     * Called when one of the players decks runs out of cards, removing 5 honor and shuffling the discard pile back into the deck
     */
    deckRanOutOfCards() {
        this.game.addMessage("{0}'s deck has run out of cards, so they shuffle", this);
        for (let card of this.discard) {
            this.moveCard(card, 'deck');
        }

        this.shuffleDeck();
    }

    /**
     * Shuffles the deck, emitting an event and displaying a message in chat
     */
    shuffleDeck() {
        this.game.emitEvent('onDeckShuffled', { player: this });
        this.deck = _.shuffle(this.deck);
    }

    /**
     * Mulligans the players starting hand, emitting an event and displaying a message in chat
     */
    takeMulligan() {
        let size = this.hand.length;

        for (let card of this.hand) {
            this.moveCard(card, 'deck');
        }

        this.shuffleDeck();
        this.drawCardsToHand(size - 1);
        this.takenMulligan = true;
    }

    /**
     * Takes a decklist passed from the lobby, creates all the cards in it, and puts references to them in the relevant lists
     */
    prepareDecks() {
        let deck = new Deck(this.deckData);
        let preparedDeck = deck.prepare(this);
        this.houses = preparedDeck.houses;
        this.deck = preparedDeck.cards;
        this.allCards = preparedDeck.cards;
        this.deckCards = this.getDeckCards(this.deckData.cards);
    }

    /**
     * Called when the Game object starts the game. Creates all cards on this players decklist, shuffles the decks and initialises player parameters for the start of the game
     */
    initialise() {
        this.prepareDecks();
        this.keys = { red: false, blue: false, yellow: false };
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
        this.playableLocations = _.reject(this.playableLocations, (l) => l === location);
    }

    beginRound() {
        this.keysForgedThisRound = [];
    }

    endRound() {
        for (let card of this.cardsInPlay) {
            card.new = false;
        }

        this.turn += 1;
    }

    /**
     * Gets the appropriate list for the passed location
     * @param {String} source
     */
    getSourceList(source) {
        if (source === 'play area') {
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
        let sourceList = this.getSourceList(source);
        let card = sourceList.find((card) => card.uuid === cardId);

        if (!card) {
            return;
        }

        // First, handle legal cases of drag/drop
        if (!this.game.manualMode) {
            this.game.pipeline.handleCardDragged(this, card, source, target);
        }

        // Any other dragging is only legal in manual mode, when the card is currently in source, when the source and target are different and when the target is a legal location
        if (
            !this.game.manualMode ||
            source === target ||
            !this.isLegalLocationForCard(card, target) ||
            card.location !== source
        ) {
            return;
        }

        let display = 'a card';
        if (
            (!card.facedown && source !== 'hand') ||
            ['play area', 'discard', 'purged'].includes(target)
        ) {
            display = card;
        }

        this.game.addAlert(
            'danger',
            '{0} manually moves {1} from their {2} to their {3}',
            this,
            display,
            source,
            target
        );
        this.moveCard(card, target);
        this.game.checkGameState(true);
    }

    /**
     * Checks whether card.type is consistent with location
     * @param card
     * @param {String} location
     */
    isLegalLocationForCard(card, location) {
        if (!card) {
            return false;
        }

        const cardLocations = ['hand', 'deck', 'discard', 'archives', 'purged', 'grafted'];
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
        if (targetLocation.endsWith(' bottom')) {
            options.bottom = true;
            targetLocation = targetLocation.replace(' bottom', '');
        }

        let targetPile = this.getSourceList(targetLocation);

        if (
            !this.isLegalLocationForCard(card, targetLocation) ||
            (targetPile && targetPile.includes(card))
        ) {
            return;
        }

        this.removeCardFromPile(card);
        let location = card.location;

        if (location === 'play area') {
            if (targetLocation !== 'archives' && card.owner !== this) {
                card.owner.moveCard(card, targetLocation, options);
                return;
            }

            for (let upgrade of card.upgrades) {
                upgrade.onLeavesPlay();
                upgrade.owner.moveCard(upgrade, 'discard');
            }

            for (let child of card.childCards) {
                child.onLeavesPlay();
                child.owner.moveCard(child, 'discard');
            }

            card.onLeavesPlay();
            card.controller = this;
        } else if (targetLocation === 'play area') {
            if (options.myControl) {
                card.setDefaultController(this);
            }
        } else if (card.owner !== this) {
            card.owner.moveCard(card, targetLocation, options);
            return;
        } else if (card.location === 'archives' && card.controller !== card.owner) {
            card.controller = card.owner;
            targetLocation = 'hand';
            targetPile = this.getSourceList(targetLocation);
        } else {
            card.controller = card.owner;
        }

        card.moveTo(targetLocation);

        if (targetLocation === 'deck' && !options.bottom) {
            targetPile.unshift(card);
        } else if (['discard', 'purged'].includes(targetLocation)) {
            // new cards go on the top of the discard pile
            targetPile.unshift(card);
        } else if (targetLocation === 'play area' && options.deployIndex !== undefined) {
            targetPile.splice(options.deployIndex + 1, 0, card);
        } else if (targetLocation === 'play area' && options.left) {
            targetPile.unshift(card);
        } else if (targetPile) {
            targetPile.push(card);
        }

        if (targetLocation !== 'play area' && card.gigantic) {
            let cardIndex = targetPile.indexOf(card);
            card.playedParts.forEach((part) => {
                part.location = targetLocation;
                targetPile.splice(cardIndex, 0, part);
            });
            card.playedParts = [];
            card.image = card.id;
        }

        this.game.raiseEvent('onCardPlaced', { card: card, from: location, to: targetLocation });
    }

    /**
     * Removes a card from whichever list it's currently in
     * @param card
     */
    removeCardFromPile(card) {
        if (card.parent) {
            if (card.parent.upgrades.includes(card)) {
                card.parent.upgrades = card.parent.upgrades.filter((c) => c !== card);
            } else if (card.parent.childCards.includes(card)) {
                card.parent.childCards = card.parent.childCards.filter((c) => c !== card);
            }

            card.parent = null;
            return;
        }

        if (card.controller !== this) {
            card.controller.removeCardFromPile(card);
            return;
        }

        if (card.location === 'play area') {
            this.cardsInPlay = this.cardsInPlay.filter((c) => c !== card);
        } else if (this[card.location]) {
            this[card.location] = this[card.location].filter((c) => c !== card);
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

    getSelectableCards() {
        return this.promptState.selectableCards;
    }

    setSelectableCards(cards) {
        this.promptState.setSelectableCards(cards);
    }

    clearSelectableCards() {
        this.promptState.clearSelectableCards();
    }

    getSummaryForCardList(list, activePlayer, hideWhenFaceup) {
        return list.map((card) => {
            return card.getSummary(activePlayer, hideWhenFaceup);
        });
    }

    getDeckCards(list) {
        let final = [];
        list.forEach((card) => {
            let arr = [];
            while (arr.length < card.count) {
                arr = arr.concat(card.card);
            }

            final = final.concat(arr);
        });
        return final;
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

    isHaunted() {
        return this.discard.length >= 10;
    }

    get maxHandSize() {
        return 6 + this.sumEffects('modifyHandSize');
    }

    getAvailableHouses() {
        let availableHouses = this.hand.concat(this.cardsInPlay).reduce((houses, card) => {
            let cardHouse = card.printedHouse;

            if (card.anyEffect('changeHouse')) {
                cardHouse = this.getEffects('changeHouse');
            }

            if (!houses.includes(cardHouse)) {
                return houses.concat(cardHouse);
            }

            return houses;
        }, this.houses);
        let stopHouseChoice = this.getEffects('stopHouseChoice');
        let restrictHouseChoice = _.flatten(this.getEffects('restrictHouseChoice')).filter(
            (house) => !stopHouseChoice.includes(house)
        );
        if (restrictHouseChoice.length > 0) {
            availableHouses = restrictHouseChoice;
        }

        availableHouses = _.difference(_.uniq(availableHouses), this.getEffects('stopHouseChoice'));
        return availableHouses;
    }

    canIgnoreHouseRestrictions(card, context) {
        return this.getEffects('canUse').some((match) => match(card, context));
    }

    getAmberSources() {
        return this.cardsInPlay
            .filter((card) => card.anyEffect('keyAmber') && card.hasToken('amber'))
            .concat(
                this.opponent
                    ? this.opponent.cardsInPlay.filter(
                          (card) => card.anyEffect('keyAmberOpponent') && card.hasToken('amber')
                      )
                    : []
            );
    }

    canForgeKey(modifier = 0) {
        if (!this.checkRestrictions('forge', this.game.getFrameworkContext(this))) {
            return false;
        }

        if (Object.values(this.keys).every((key) => key)) {
            return false;
        }

        let alternativeSources = this.getAmberSources().reduce(
            (total, source) => total + source.tokens.amber,
            0
        );
        return this.amber + alternativeSources >= this.getCurrentKeyCost() + modifier;
    }

    getCurrentKeyCost() {
        return this.sumEffects('modifyKeyCost') + 6;
    }

    getForgedKeys() {
        return Math.max(0, Object.values(this.keys).filter((key) => key).length);
    }

    forgeKey(modifier) {
        let cost = Math.max(0, this.getCurrentKeyCost() + modifier);
        let modifiedCost = cost;
        let unforgedKeys = this.getUnforgedKeys();
        let amberSources = this.getAmberSources();
        if (amberSources.length > 0) {
            let totalAvailable = amberSources.reduce(
                (total, source) => total + source.tokens.amber,
                0
            );
            for (let source of amberSources) {
                this.game.queueSimpleStep(() => {
                    let max = Math.min(modifiedCost, source.tokens.amber);
                    let min = Math.max(
                        0,
                        modifiedCost - this.amber - totalAvailable + source.tokens.amber
                    );
                    if (max === min) {
                        modifiedCost -= max;
                        totalAvailable -= max;
                        source.removeToken('amber', max);
                        return;
                    }

                    this.game.promptWithHandlerMenu(this, {
                        activePromptTitle: {
                            text: 'How much amber do you want to use from {{card}}?',
                            values: { card: source.name }
                        },
                        source: source,
                        choices: _.range(min, max + 1),
                        choiceHandler: (choice) => {
                            modifiedCost -= choice;
                            totalAvailable -= choice;
                            source.removeToken('amber', choice);
                        }
                    });
                });
            }
        }

        if (unforgedKeys.length > 1) {
            this.game.promptWithHandlerMenu(this, {
                activePromptTitle: { text: 'Which key would you like to forge?' },
                source: 'Forge a key',
                choices: unforgedKeys,
                choiceHandler: (key) => {
                    this.game.queueSimpleStep(() => {
                        this.finalizeForge(key.value, modifiedCost, cost);
                    });
                }
            });
        } else {
            this.game.queueSimpleStep(() =>
                this.finalizeForge(unforgedKeys.shift().value, modifiedCost, cost)
            );
        }
    }

    finalizeForge(key, modifiedCost, cost) {
        this.modifyAmber(-modifiedCost);

        if (this.anyEffect('forgeAmberGainedByOpponent')) {
            this.game.actions
                .gainAmber({ amount: cost })
                .resolve(this.opponent, this.game.getFrameworkContext());
        }

        this.keys[key] = true;
        this.keysForgedThisRound.push(key);
        this.game.addMessage(
            '{0} forges the {1}, paying {2} amber',
            this.game.activePlayer,
            `forgedkey${key}`,
            modifiedCost
        );
    }

    unforgeKey(choices) {
        if (choices.length > 1) {
            this.game.promptWithHandlerMenu(this, {
                activePromptTitle: { text: 'Which key would you like to unforge?' },
                source: 'Unforge a key',
                choices: this.getKeyOptions(choices),
                choiceHandler: (key) => {
                    this.game.queueSimpleStep(() => {
                        this.keys[key.value] = false;
                        let forgedKeyIndex = this.keysForgedThisRound.findIndex(
                            (x) => x === key.value
                        );
                        if (forgedKeyIndex !== -1) {
                            this.keysForgedThisRound.splice(forgedKeyIndex, 1);
                        }

                        this.game.addMessage(
                            "{0} unforges {1}'s {2}",
                            this.game.activePlayer,
                            this.game.activePlayer.opponent,
                            `forgedkey${key.value}`
                        );
                    });
                }
            });
        } else {
            this.keys[choices[0].toLowerCase()] = false;
            let forgedKeyIndex = this.keysForgedThisRound.findIndex(
                (x) => x === choices[0].toLowerCase()
            );
            if (forgedKeyIndex !== -1) {
                this.keysForgedThisRound.splice(forgedKeyIndex, 1);
            }

            this.game.addMessage(
                '{0} unforges the {1}',
                this.game.activePlayer,
                `forgedkey${choices[0]}`
            );
        }
    }

    getUnforgedKeys() {
        return [
            { text: 'Red', value: 'red', icon: 'unforgedkeyred' },
            { text: 'Blue', value: 'blue', icon: 'unforgedkeyblue' },
            { text: 'Yellow', value: 'yellow', icon: 'unforgedkeyyellow' }
        ].filter((key) => !this.keys[key.value]);
    }

    getKeyOptions(options) {
        return [
            { text: 'Red', value: 'red', icon: 'forgedkeyred' },
            { text: 'Blue', value: 'blue', icon: 'forgedkeyblue' },
            { text: 'Yellow', value: 'yellow', icon: 'forgedkeyyellow' }
        ].filter((key) => options.includes(key.value));
    }

    getAdditionalCosts(context) {
        return this.getEffects('additionalCost')
            .reduce((array, costFactory) => array.concat(costFactory(context)), [])
            .filter((cost) => !!cost);
    }

    setWins(wins) {
        this.wins = wins;
    }

    getStats() {
        return {
            amber: this.amber,
            chains: this.chains,
            keys: this.keys,
            houses: this.houses,
            keyCost: this.getCurrentKeyCost()
        };
    }

    /**
     * This information is passed to the UI
     * @param {Player} activePlayer
     */

    getState(activePlayer, gameFormat) {
        let isActivePlayer = activePlayer === this;
        let promptState = isActivePlayer ? this.promptState.getState() : {};
        let state = {
            activeHouse: this.activeHouse,
            cardPiles: {
                archives: this.getSummaryForCardList(this.archives, activePlayer),
                cardsInPlay: this.getSummaryForCardList(this.cardsInPlay, activePlayer),
                discard: this.getSummaryForCardList(this.discard, activePlayer),
                hand: this.getSummaryForCardList(this.hand, activePlayer, true),
                purged: this.getSummaryForCardList(this.purged, activePlayer)
            },
            cardback: 'cardback',
            disconnected: !!this.disconnectedAt,
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
            user: _.omit(this.user, ['password', 'email']),
            deckCards: this.deckCards,
            deckData: this.deckData,
            wins: this.wins
        };

        if (isActivePlayer) {
            let sortedDeck = this.deck.slice();
            sortedDeck.sort((a, b) => {
                if (a.printedHouse < b.printedHouse) {
                    return -1;
                } else if (a.printedHouse > b.printedHouse) {
                    return 1;
                } else if (a.id < b.id) {
                    return -1;
                } else if (a.id > b.id) {
                    return 1;
                }

                return 0;
            });
            state.cardPiles.deck = this.getSummaryForCardList(sortedDeck, activePlayer, true);
        } else if (gameFormat === 'sealed') {
            state.deckCards = [];
        }

        if (this.isTopCardShown()) {
            state.deckTopCard = this.deck[0].getSummary(activePlayer);
        }

        if (this.clock) {
            state.clock = this.clock.getState();
        }

        return _.extend(state, promptState);
    }
}

module.exports = Player;
