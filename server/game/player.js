const _ = require('underscore');

const Constants = require('../constants');
const GameObject = require('./GameObject');
const Deck = require('./deck');
const ClockSelector = require('./Clocks/ClockSelector');
const PlayableLocation = require('./playablelocation');
const PlayerPromptState = require('./playerpromptstate');
const { EVENTS } = require('./Events/types');

class Player extends GameObject {
    constructor(id, user, owner, game, clockdetails) {
        super(game);
        this.user = user;
        this.emailHash = this.user.emailHash;
        this.id = id;
        this.owner = owner;

        this.hand = [];
        this.cardsInPlay = []; // This stores references to all creatures and artifacts in play.  Upgrades are not stored here.
        this.discard = [];
        this.purged = [];
        this.archives = [];
        this.wins = 0;

        this.houses = [];
        this.activeHouse = null;
        this.tieBreakHouse = null;

        this.deckData = {};
        this.tokenCard = null;
        this.mulliganDecided = false;

        this.chains = 0;
        this.keysForgedThisRound = [];

        this.clock = ClockSelector.for(this, clockdetails);
        this.showDeck = false;
        this.role = user.role;
        this.avatar = user.avatar;

        this.playableLocations = [new PlayableLocation('play', this, 'hand')];
        this.optionSettings = user.settings.optionSettings;

        this.left = false;
        this.disconnectedAt = null;

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

    setTieBreakHouse(house) {
        this.tieBreakHouse = house;
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
        return this.cardsInPlay.some((card) => {
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

    get activeProphecies() {
        return this.prophecyCards.filter((card) => card.activeProphecy);
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
            this.moveCard(card, 'hand', { drawn: true });
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
            this.moveCard(card, 'deck', { aboutToShuffle: true });
        }

        this.shuffleDeck(true);
    }

    /**
     * Shuffles the deck, emitting an event and displaying a message in chat
     */
    shuffleDeck(shuffledDiscardIntoDeck = false) {
        this.deck = _.shuffle(this.deck);
        if (this.isTopCardOfDeckVisible() && this.deck.length > 0) {
            this.addTopCardOfDeckVisibleMessage();
        }
        this.game.raiseEvent(EVENTS.onDeckShuffled, {
            player: this,
            shuffledDiscardIntoDeck: shuffledDiscardIntoDeck
        });
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
        this.mulliganDecided = true;
    }

    /**
     * Takes a decklist passed from the lobby, creates all the cards in it, and puts references to them in the relevant lists
     */
    prepareDecks() {
        let deck = new Deck(this.deckData);
        let preparedDeck = deck.prepare(this);
        this.tokenCard = preparedDeck.tokenCard;
        this.houses = preparedDeck.houses;
        this.deck = preparedDeck.cards;
        this.allCards = preparedDeck.cards;
        this.prophecyCards = preparedDeck.prophecyCards;
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
        this.tieBreakHouse = null;
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

        if (target === 'play area') {
            if (card.type === 'creature' && this.creaturesInPlay.length > 0) {
                let choices = ['Left', 'Right'];

                if (this.creaturesInPlay.length > 1) {
                    choices.push('Deploy Left');
                    choices.push('Deploy Right');
                }

                this.game.promptWithHandlerMenu(
                    this,
                    {
                        activePromptTitle: 'Which flank do you want to place this creature on?',
                        context: this.game.context,
                        source: card,
                        choices: choices,
                        choiceHandler: (choice) => {
                            let deploy;
                            let flank;

                            switch (choice) {
                                case 'Left':
                                    flank = 'left';
                                    deploy = false;

                                    break;
                                case 'Right':
                                    flank = 'right';
                                    deploy = false;

                                    break;
                                case 'Deploy Left':
                                    flank = 'left';
                                    deploy = true;

                                    break;
                                case 'Deploy Right':
                                    flank = 'right';
                                    deploy = true;

                                    break;
                            }

                            if (deploy) {
                                this.game.promptForSelect(this, {
                                    source: card,
                                    activePromptTitle: `Select a card to deploy to the ${flank} of`,
                                    cardCondition: (card) =>
                                        card.location === 'play area' &&
                                        card.controller === this &&
                                        card.type === 'creature',
                                    onSelect: (p, c) => {
                                        let deployIndex = card.controller.cardsInPlay.indexOf(c);
                                        if (flank === 'left' && deployIndex >= 0) {
                                            deployIndex--;
                                        }

                                        this.moveCard(card, 'play area', {
                                            left: flank === 'left',
                                            deployIndex: deployIndex
                                        });

                                        return true;
                                    }
                                });
                            } else {
                                this.moveCard(card, 'play area', {
                                    left: flank === 'left'
                                });
                            }
                        }
                    },
                    this
                );
            } else if (card.type === 'upgrade') {
                let title = `Select a creature`;
                let cardType = ['creature'];
                if (card.anyEffect('canAttachToArtifacts')) {
                    title = 'Select a card';
                    cardType = cardType.concat(['artifact']);
                }
                if (this.game.creaturesInPlay.length > 0) {
                    this.game.promptForSelect(this, {
                        source: card,
                        activePromptTitle: title,
                        cardCondition: (card) =>
                            card.location === 'play area' && cardType.includes(card.type),
                        onSelect: (p, parent) => {
                            this.removeCardFromPile(card);
                            card.new = true;
                            card.moveTo('play area');

                            parent.upgrades.push(card);
                            card.parent = parent;

                            card.updateEffectContexts();
                            return true;
                        }
                    });
                }
            } else {
                this.moveCard(card, target);
            }
        } else {
            this.moveCard(card, target);
        }
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

    checkDeckAfterCardMove(oldTopOfDeck) {
        if (this.isTopCardOfDeckVisible() && this.deck.length > 0) {
            if (oldTopOfDeck != this.deck[0]) {
                this.addTopCardOfDeckVisibleMessage();
            }
        }
    }

    /**
     * Moves a card from one location to another. This involves removing in from the list it's currently in, calling DrawCard.move (which changes
     * its location property), and then adding it to the list it should now be in
     * @param card
     * @param {String} targetLocation
     * @param {Object} options
     */
    moveCard(card, targetLocation, options = {}) {
        let origCard = card.createSnapshot();

        if (targetLocation.endsWith(' bottom')) {
            options.bottom = true;
            targetLocation = targetLocation.replace(' bottom', '');
        }

        let targetPile = this.getSourceList(targetLocation);

        if (
            !this.isLegalLocationForCard(card, targetLocation) ||
            (targetPile &&
                targetPile.includes(card) &&
                (targetLocation !== 'deck' ||
                    targetPile[options.bottom ? targetPile.length - 1 : 0] === card)) ||
            (card.controller.anyEffect('opponentCardsCannotLeaveArchives') &&
                card.location === 'archives' &&
                card.owner != card.controller)
        ) {
            return;
        }

        let oldTopOfDeck = card.owner.deck[0];
        this.removeCardFromPile(card);
        let location = card.location;
        targetPile = this.getSourceList(targetLocation);

        if (location === 'purged' && card.purgedBy) {
            card.purgedBy.purgedCards = card.purgedBy.purgedCards.filter((c) => c !== card);
            card.purgedBy = null;
        }

        if (location === 'play area') {
            if (targetLocation !== 'archives' && card.owner !== this) {
                card.owner.moveCard(card, targetLocation, options);
                return;
            }

            card.clearDependentCards();

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
            this.game.addMessage(
                `{0} leaves the archives and will be returned its owner hand`,
                card
            );

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
        } else if (targetLocation === 'play area' && options.deployIndex >= -1) {
            targetPile.splice(options.deployIndex + 1, 0, card);
        } else if (targetLocation === 'play area' && options.left) {
            targetPile.unshift(card);
        } else if (targetPile) {
            targetPile.push(card);
        }

        let composedPart = null;
        if (targetLocation !== 'play area' && card.gigantic) {
            let cardIndex = targetPile.indexOf(card);
            if (card.composedPart) {
                composedPart = card.composedPart;
                card.composedPart.controller = card.controller;
                card.composedPart.location = targetLocation;
                targetPile.splice(cardIndex, 0, card.composedPart);
                card.composedPart = null;
            }
            card.image = card.id;
        }

        this.game.raiseEvent(EVENTS.onCardPlaced, {
            card: card,
            // Remember the card as it was originally (e.g.,
            // tokens that have left play need to be remembered as tokens).
            cloneOverride: origCard,
            from: location,
            to: targetLocation,
            drawn: options.drawn
        });
        if (composedPart) {
            this.game.raiseEvent(EVENTS.onCardPlaced, {
                card: composedPart,
                from: location,
                to: targetLocation,
                drawn: options.drawn
            });
        }

        if (!options.aboutToShuffle) {
            card.owner.checkDeckAfterCardMove(oldTopOfDeck);
        }
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
        if (this.anyEffect('countPurgedForHaunted')) {
            return this.discard.length + this.purged.length >= 10;
        }
        return this.discard.length >= 10;
    }

    get maxHandSize() {
        return 6 + this.sumEffects('modifyHandSize');
    }

    getAvailableHouses() {
        let availableHouses = this.hand.concat(this.cardsInPlay).reduce((houses, card) => {
            let cardForHouses = card.isToken() && card.tokenCard() ? card.tokenCard() : card;

            // Only cards in play can use their house enhancements to control what houses are available.
            let cardHouses =
                cardForHouses.location === 'play area'
                    ? cardForHouses.getHouses()
                    : [cardForHouses.printedHouse];

            if (card.anyEffect('changeHouse')) {
                cardHouses = card.getEffects('changeHouse');
            }

            for (let house of cardHouses) {
                if (!houses.includes(house)) {
                    houses.push(house);
                }
            }

            return houses;
        }, this.houses.slice());
        let stopHouseChoice = this.getEffects('stopHouseChoice');
        let restrictHouseChoice = _.flatten(this.getEffects('restrictHouseChoice')).filter(
            (house) => !stopHouseChoice.includes(house) && availableHouses.includes(house)
        );
        if (restrictHouseChoice.length > 0) {
            availableHouses = restrictHouseChoice;
        }

        availableHouses = _.difference(_.uniq(availableHouses), this.getEffects('stopHouseChoice'));
        return availableHouses;
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

    getCardAmberInPoolSources() {
        return this.cardsInPlay.filter((card) => card.anyEffect('isAmberInPool'));
    }

    canForgeKey(modifier = 0, keyColor = '') {
        if (!this.checkRestrictions('forge', this.game.getFrameworkContext(this))) {
            return false;
        }

        if (Object.values(this.keys).every((key) => key)) {
            return false;
        }

        if (
            keyColor &&
            !this.getUnforgedKeys()
                .map((k) => k.value)
                .includes(keyColor)
        ) {
            return false;
        }

        // Check if player has already forged a key this round and doesn't have the effect
        if (
            this.keysForgedThisRound.length > 1 &&
            this.anyEffect('cannotForgeMoreThan2KeysInATurn')
        ) {
            return false;
        }

        let alternativeSources =
            this.getAmberSources().reduce((total, source) => total + source.amber, 0) +
            this.getCardAmberInPoolSources().length;
        return this.amber + alternativeSources >= this.getCurrentKeyCost() + modifier;
    }

    getCurrentKeyCost() {
        return this.sumEffects('modifyKeyCost') + 6;
    }

    getForgedKeys() {
        return Math.max(0, Object.values(this.keys).filter((key) => key).length);
    }

    forgeKey(modifier, keyColor = '') {
        let cost = Math.max(0, this.getCurrentKeyCost() + modifier);
        let amberSources = this.getAmberSources();
        let selfAmberSources = this.getCardAmberInPoolSources();
        let totalAvailable =
            amberSources.reduce((total, source) => total + source.amber, 0) +
            selfAmberSources.length;
        this.chooseAmberSource(
            amberSources,
            selfAmberSources,
            totalAvailable,
            cost,
            cost,
            keyColor
        );
        return cost;
    }

    chooseAmberSource(
        amberSources,
        selfAmberSources,
        totalAvailable,
        modifiedCost,
        initialCost,
        keyColor
    ) {
        if (modifiedCost === 0 || (amberSources.length === 0 && selfAmberSources.length === 0)) {
            this.chooseKeyToForge(modifiedCost, initialCost, keyColor);
            return;
        }

        if (amberSources.length > 0) {
            // Spending amber on cards for a key.
            let source = amberSources[0];
            amberSources.shift();
            this.game.queueSimpleStep(() => {
                let sourceAmber = source.amber;
                let max = Math.min(modifiedCost, sourceAmber);
                let min = Math.max(0, modifiedCost - this.amber - totalAvailable + sourceAmber);
                if (max === min) {
                    this.game.addMessage(
                        `{0} uses ${max} amber from {1} to forge a key`,
                        this.game.activePlayer,
                        source
                    );
                    source.removeToken('amber', max);
                    this.chooseAmberSource(
                        amberSources,
                        selfAmberSources,
                        totalAvailable - max,
                        modifiedCost - max,
                        initialCost,
                        keyColor
                    );
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
                        if (choice) {
                            source.removeToken('amber', choice);
                            this.game.addMessage(
                                `{0} uses ${choice} amber from {1} to forge a key`,
                                this.game.activePlayer,
                                source
                            );
                        }
                        this.chooseAmberSource(
                            amberSources,
                            selfAmberSources,
                            totalAvailable - sourceAmber,
                            modifiedCost - choice,
                            initialCost,
                            keyColor
                        );
                    }
                });
            });
            return;
        }

        // Spending a card itself as one amber towards a key.
        let source = selfAmberSources[0];
        selfAmberSources.shift();
        this.game.queueSimpleStep(() => {
            let max = 1;
            let min = Math.max(0, modifiedCost - this.amber - totalAvailable + 1);
            if (max === min) {
                this.game.addMessage(
                    `{0} spends {1} to forge a key`,
                    this.game.activePlayer,
                    source
                );
                source.removeToken('ward', source.ward);
                this.moveCard(source, 'discard');
                this.chooseAmberSource(
                    amberSources,
                    selfAmberSources,
                    totalAvailable - max,
                    modifiedCost - max,
                    initialCost,
                    keyColor
                );
                return;
            }

            this.game.promptWithHandlerMenu(this, {
                activePromptTitle: {
                    text: 'Do you want to spend {{card}} to forge a key?',
                    values: { card: source.name }
                },
                source: source,
                choices: ['Yes', 'No'],
                handlers: [
                    () => {
                        source.removeToken('ward', source.ward);
                        this.moveCard(source, 'discard');
                        this.game.addMessage(
                            `{0} spends {1} to forge a key`,
                            this.game.activePlayer,
                            source
                        );
                        this.chooseAmberSource(
                            amberSources,
                            selfAmberSources,
                            totalAvailable - 1,
                            modifiedCost - 1,
                            initialCost,
                            keyColor
                        );
                        return true;
                    },
                    () => {
                        this.chooseAmberSource(
                            amberSources,
                            selfAmberSources,
                            totalAvailable - 1,
                            modifiedCost,
                            initialCost,
                            keyColor
                        );
                        return true;
                    }
                ]
            });
        });
    }

    chooseKeyToForge(modifiedCost, initialCost, keyColor) {
        let unforgedKeys = this.getUnforgedKeys();
        if (keyColor) {
            unforgedKeys = unforgedKeys.filter((k) => k.value === keyColor);
        }
        if (unforgedKeys.length > 1) {
            this.game.promptWithHandlerMenu(this, {
                activePromptTitle: { text: 'Which key would you like to forge?' },
                source: 'Forge a key',
                choices: unforgedKeys,
                choiceHandler: (key) => {
                    this.game.queueSimpleStep(() => {
                        this.finalizeForge(key.value, modifiedCost, initialCost);
                    });
                }
            });
        } else {
            this.game.queueSimpleStep(() =>
                this.finalizeForge(unforgedKeys.shift().value, modifiedCost, initialCost)
            );
        }
    }

    finalizeForge(key, modifiedCost, cost) {
        this.modifyAmber(-modifiedCost);

        // Check if opponent has redirectForgeAmber effect (e.g. The Sting)
        const redirectEffect = this.effects.find((effect) => effect.type === 'redirectForgeAmber');
        if (this.opponent && redirectEffect) {
            this.opponent.modifyAmber(modifiedCost);
            this.game.addMessage(
                '{0} receives {1} amber from {2}',
                this.opponent,
                modifiedCost,
                redirectEffect.context.source
            );
        }

        this.keys[key] = true;
        this.keysForgedThisRound.push(key);
        this.game.addMessage('{0} forges the {1}, paying {2} amber', this, `forgedkey${key}`, cost);
    }

    unforgeKey(choices) {
        choices = choices || Object.keys(this.keys).filter((key) => this.keys[key]);

        if (choices.length > 1) {
            this.game.promptWithHandlerMenu(this, {
                activePromptTitle: { text: 'Which key would you like to unforge?' },
                source: 'Unforge a key',
                choices: this.getKeyOptions(choices),
                choiceHandler: (key) => {
                    this.game.queueSimpleStep(() => {
                        if (this.keys[key.value]) {
                            this.game.addMessage(
                                '{0} unforges {1}{2}{3}',
                                this.game.activePlayer,
                                this.game.activePlayer === this ? 'their' : this,
                                this.game.activePlayer === this ? ' ' : "'s ",
                                `forgedkey${key.value}`
                            );
                        }

                        this.keys[key.value] = false;
                    });
                }
            });
        } else if (choices.length === 1) {
            if (this.keys[choices[0].toLowerCase()]) {
                this.game.addMessage(
                    '{0} unforges {1}{2}{3}',
                    this.game.activePlayer,
                    this.game.activePlayer === this ? 'their' : this,
                    this.game.activePlayer === this ? ' ' : "'s ",
                    `forgedkey${choices[0].toLowerCase()}`
                );
            }

            this.keys[choices[0].toLowerCase()] = false;
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

    isTopCardOfDeckVisible() {
        return this.getEffects('topCardOfDeckVisible').length > 0;
    }

    addTopCardOfDeckVisibleMessage() {
        this.game.addMessage(
            '{0} uses {1} to reveal {2} on top of their deck',
            this,
            this.mostRecentEffect('topCardOfDeckVisible'),
            this.deck[0]
        );
    }

    setWins(wins) {
        this.wins = wins;
    }

    isTideRequired() {
        let expansion = Constants.Expansions.find(
            (expansion) => expansion.id === this.deckData.expansion
        );
        return expansion && expansion.tideRequired;
    }

    getStats() {
        return {
            amber: this.amber,
            chains: this.chains,
            keys: this.keys,
            houses: this.houses,
            keyCost: this.getCurrentKeyCost(),
            tideRequired: this.isTideRequired(),
            tide: this.isTideHigh()
                ? Constants.Tide.HIGH
                : this.isTideLow()
                ? Constants.Tide.LOW
                : Constants.Tide.NEUTRAL
        };
    }

    isTideHigh() {
        return this.game.highTide === this;
    }

    isTideLow() {
        return this.game.highTide ? this.game.highTide !== this : false;
    }

    getDiscardSlice(n = 1) {
        if (this.discard.length <= Math.abs(n)) {
            // Return the exact discard array if we are including
            // everything; that way, we can trigger effects that (for
            // example) depend on shuffling the full discard into the deck.
            return this.discard;
        } else if (n < 0) {
            return this.discard.slice(n);
        }
        return this.discard.slice(0, n);
    }

    getDiscardWithCondition(condition = () => true) {
        let res = this.discard.filter(condition);
        if (res.length === this.discard.length) {
            // Return the exact discard array if we are including
            // everything; that way, we can trigger effects that (for
            // example) depend on shuffling the full discard into the deck.
            return this.discard;
        }
        return res;
    }

    /**
     * This information is passed to the UI
     * @param {Player} activePlayer
     */

    getState(activePlayer) {
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
            canRaiseTide:
                !this.isTideHigh() &&
                this.game.actions.raiseTide().canAffect(this, this.game.getFrameworkContext()),
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
            user: {
                id: this.user.id,
                username: this.user.username,
                settings: this.user.settings,
                role: this.user.role,
                avatar: this.user.avatar
            },
            deckData: this.deckData,
            tokenCard: this.tokenCard && this.tokenCard.getShortSummary(),
            prophecyCards: this.getSummaryForCardList(this.prophecyCards, activePlayer),
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
        }

        if (this.isTopCardShown()) {
            state.deckTopCard = this.deck[0].getSummary(activePlayer);
        }

        if (this.clock) {
            state.clock = this.clock.getState();
        }

        return _.extend(state, promptState);
    }

    prophecyIndex(prophecyCard) {
        return this.prophecyCards.indexOf(prophecyCard);
    }

    // Prophecy cards are paired in the prophecyCards array.  The first card in the pair is the front of the prophecy, and the second card is the back.
    prophecyFlipSide(prophecyCard) {
        let index = this.prophecyIndex(prophecyCard);
        if (index === -1) {
            return null;
        }
        if (index % 2 === 0) {
            if (index >= this.prophecyCards.length - 1) {
                return null;
            }
            return this.prophecyCards[index + 1];
        }
        if (index <= 0) {
            return null;
        }
        return this.prophecyCards[index - 1];
    }

    // A prophecy can be activated if it is a prophecy card and not already active,
    // and the flip side of the prophecy is not active. It must also be controlled
    // by this player and it must be this player’s turn.
    canActivateProphecy(prophecyCard) {
        if (
            !prophecyCard.isProphecy() ||
            prophecyCard.activeProphecy ||
            prophecyCard.controller !== this ||
            (!this.game.manualMode &&
                (this.game.propheciesActivatedThisPhase.length > 0 ||
                    // TODO(fionawhim): Also require that we’re in the main
                    // step.
                    this.game.activePlayer !== this)) ||
            this.hand.length === 0
        ) {
            return false;
        }
        let flipProphecy = this.prophecyFlipSide(prophecyCard);
        if (!flipProphecy) {
            return false;
        }
        return !flipProphecy.activeProphecy;
    }

    activateProphecy(context, prophecyCard, showMessage = true) {
        if (!this.canActivateProphecy(prophecyCard)) {
            return false;
        }
        this.game.prophecyActivated(prophecyCard);
        prophecyCard.activeProphecy = true;
        this.game.raiseEvent(EVENTS.onProphecyActivated, { prophecyCard: prophecyCard });

        if (showMessage) {
            this.game.addMessage('{0} activates their prophecy {1}', this, prophecyCard);
        }

        return true;
    }

    deactivateProphecy(prophecyCard) {
        prophecyCard.activeProphecy = false;
        this.game.raiseEvent(EVENTS.onProphecyDeactivated, { prophecyCard: prophecyCard });
    }

    flipProphecy(context, prophecyCard) {
        if (!prophecyCard.isProphecy() || !prophecyCard.activeProphecy) {
            return false;
        }
        let flipSide = this.prophecyFlipSide(prophecyCard);
        if (!flipSide) {
            return false;
        }
        this.deactivateProphecy(prophecyCard);
        flipSide.activeProphecy = true;
        // Move any cards under the prophecy to the flipside.
        flipSide.childCards = prophecyCard.childCards;
        prophecyCard.childCards = [];
        flipSide.childCards.forEach((card) => {
            card.parent = flipSide;
        });
        this.game.raiseEvent(EVENTS.onProphecyFlipped, { prophecyCard: flipSide });
        return true;
    }
}

module.exports = Player;
