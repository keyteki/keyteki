const _ = require('underscore');

const Spectator = require('./spectator.js');
const Deck = require('./deck.js');
const AttachmentPrompt = require('./gamesteps/attachmentprompt.js');
const ConflictTracker = require('./conflicttracker.js');
const PlayableLocation = require('./playablelocation.js');
const PlayActionPrompt = require('./gamesteps/playactionprompt.js');
const PlayerPromptState = require('./playerpromptstate.js');
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
        this.cardsInPlay = _([]);
        this.strongholdProvince = _([]);
        this.provinceOne = _([]);
        this.provinceTwo = _([]);
        this.provinceThree = _([]);
        this.provinceFour = _([]);
        this.dynastyDiscardPile = _([]);
        this.conflictDiscardPile = _([]);
        this.additionalPiles = {};

        this.faction = {};
        this.stronghold = new StrongholdCard(this, {});

        this.owner = owner;
        this.game = game;

        //Phase Values
        this.takenDynastyMulligan = false;
        this.takenConflictMulligan = false;
        this.passedDynasty = false;
        this.honorBid = 0;
        this.showBid = 0;
        this.imperialFavor = '';
        this.totalGloryForFavor = 0;


        this.deck = {};
        this.conflicts = new ConflictTracker();
        this.minReserve = 0;
        this.costReducers = [];
        this.playableLocations = [
            new PlayableLocation('play', this, 'hand'),
            new PlayableLocation('dynasty', this, 'province 1'),
            new PlayableLocation('dynasty', this, 'province 2'),
            new PlayableLocation('dynasty', this, 'province 3'),
            new PlayableLocation('dynasty', this, 'province 4')
        ];
        this.cannotGainConflictBonus = false;
        this.abilityRestrictions = [];
        this.abilityMaxByTitle = {};
        this.canInitiateAction = false;
        this.promptedActionWindows = user.promptedActionWindows || {
            dynasty: true,
            draw: true,
            preConflict: true,
            conflict: true,
            fate: true,
            regroup: true
        };
        this.timerSettings = user.settings.timerSettings || {};
        this.timerSettings.windowTimer = user.settings.windowTimer;
        this.keywordSettings = user.settings.keywordSettings;

        this.createAdditionalPile('out of game', { title: 'Out of Game', area: 'player row' });

        this.promptState = new PlayerPromptState();
    }

    isCardUuidInList(list, card) {
        return list.any(c => {
            return c.uuid === card.uuid;
        });
    }

    isCardNameInList(list, card) {
        return list.any(c => {
            return c.name === card.name;
        });
    }

    areCardsSelected() {
        return this.cardsInPlay.any(card => {
            return card.selected;
        });
    }

    removeCardByUuid(list, uuid) {
        return _(list.reject(card => {
            return card.uuid === uuid;
        }));
    }

    findCardByName(list, name) {
        return this.findCard(list, card => card.name === name);
    }

    findCardByUuid(list, uuid) {
        return this.findCard(list, card => card.uuid === uuid);
    }

    findCardInPlayByUuid(uuid) {
        return this.findCard(this.cardsInPlay, card => card.uuid === uuid);
    }

    findCard(cardList, predicate) {
        var cards = this.findCards(cardList, predicate);
        if(!cards || _.isEmpty(cards)) {
            return undefined;
        }

        return cards[0];
    }

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

    attachStronghold() {
        this.moveCard(this.stronghold, 'stronghold province');
        if(this.role) {
            this.role.moveTo('role');
        }
    }

    fillProvinces() {
        var provinces = ['province 1', 'province 2', 'province 3', 'province 4'];

        _.each(provinces, province => {
            let card = this.getDynastyCardInProvince(province);
            if(card) {
                card.facedown = true;
            } else {
                this.moveCard(this.dynastyDeck.first(), province);
            }
        });
    }
    
    getDynastyCardInProvince(location) {
        let province = this.getSourceList(location);
        return province.find(card => card.isDynasty);
    }

    getProvinceCardInProvince(location) {
        let province = this.getSourceList(location);
        return province.find(card => card.isProvince);
    }

    discardFromBrokenProvinces() {
        _.each(['province 1', 'province 2', 'province 3', 'province 4'], location => {
            let provinceCard = this.getProvinceCardInProvince(location);
            let dynastyCard = this.getDynastyCardInProvince(location);
            if(dynastyCard) {
                if(provinceCard && provinceCard.isBroken && !dynastyCard.facedown) {
                    this.moveCard(dynastyCard,'dynasty discard pile');
                }
            } else {
                this.replaceDynastyCard(location);
            }
        });
    }

    anyCardsInPlay(predicate) {
        return this.game.allCards.any(card => card.controller === this && card.location === 'play area' && predicate(card));
    }

    filterCardsInPlay(predicate) {
        return this.game.allCards.filter(card => card.controller === this && card.location === 'play area' && predicate(card));
    }

    getNumberOfCardsInPlay(predicate) {
        return this.game.allCards.reduce((num, card) => {
            if(card.controller === this && card.location === 'play area' && predicate(card)) {
                return num + 1;
            }

            return num;
        }, 0);
    }

    getNumberOfHoldingsInPlay() {
        return _.reduce(['province 1', 'province 2', 'province 3', 'province 4'], (n, province) => {
            if(this.getSourceList(province).any(card => card.getType() === 'holding' && !card.facedown)) {
                return n + 1;
            }
            return n;
        }, 0);
    }

    isCardInPlayableLocation(card, playingType) {
        return _.any(this.playableLocations, location => location.playingType === playingType && location.contains(card));
    }

    getDuplicateInPlay(card) {
        if(!card.isUnique()) {
            return undefined;
        }

        return this.findCard(this.cardsInPlay, playCard => {
            return playCard !== card && (playCard.id === card.id || playCard.name === card.name);
        });
    }

    getNumberOfConflictsWon(conflictType) {
        return this.conflicts.getWon(conflictType);
    }

    getNumberOfConflictsLost(conflictType) {
        return this.conflicts.getLost(conflictType);
    }

    getNumberOfConflictsInitiatedByType(conflictType) {
        return this.conflicts.getPerformed(conflictType);
    }

    getNumberOfConflictsInitiated() {
        return this.conflicts.complete;
    }

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
            cards = _.extend(cards, moreCards);
        }

        return (cards.length > 1) ? cards : cards[0];
    }

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

    replaceDynastyCard(location) {
        if(this.dynastyDeck.size() === 0) {
            this.deckRanOutOfCards('dynasty');
        }
        this.moveCard(this.dynastyDeck.first(), location);
    }

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

    shuffleConflictDeck() {
        this.game.addMessage('{0} is shuffling their conflict deck', this);
        this.conflictDeck = _(this.conflictDeck.shuffle());
    }

    shuffleDynastyDeck() {
        this.game.addMessage('{0} is shuffling their dynasty deck', this);
        this.dynastyDeck = _(this.dynastyDeck.shuffle());
    }


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

    moveCardToTopOfDeck(card) {
        this.game.raiseCardLeavesPlayEvent(card, card.isDynasty ? 'dynasty deck' : 'conflict deck');
    }
    
    moveCardToBottomOfDeck(card) {
        this.game.raiseCardLeavesPlayEvent(card, card.isDynasty ? 'dynasty deck bottom' : 'conflict deck bottom');
    }

    moveFromTopToBottomOfConflictDrawDeck(number) {
        while(number > 0) {
            this.moveCard(this.conflictDeck.first(), 'conflict deck', { bottom: true });

            number--;
        }
    }

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

    canInitiateConflict(conflictType) {
        return (!this.conflicts.isAtMax(conflictType) &&
                this.conflicts.conflictOpportunities > 0);
    }

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

    prepareDecks() {
        var deck = new Deck(this.deck);
        var preparedDeck = deck.prepare(this);
        this.faction = preparedDeck.faction;
        this.provinceDeck = _(preparedDeck.provinceCards);
        this.stronghold = preparedDeck.stronghold;
        this.role = preparedDeck.role;
        this.conflictDeck = _(preparedDeck.conflictCards);
        this.dynastyDeck = _(preparedDeck.dynastyCards);
        this.preparedDeck = preparedDeck;
    }

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

    startGame() {
        if(!this.readyToStart) {
            return;
        }

        this.opponent = this.game.getOtherPlayer(this);
        this.honor = this.stronghold.cardData.honor;
        //this.game.raiseEvent('onStatChanged', this, 'honor');
    }

    dynastyMulligan(cards) {
        if(this.takenDynastyMulligan) {
            return false;
        }

        _.each(cards, card => {
            this.removeCardFromPile(card);
        });

        this.takenDynastyMulligan = true;

        this.fillProvinces();

        _.each(cards, card => {
            card.moveTo('dynasty deck');
            this.dynastyDeck.push(card);
        });

        this.shuffleDynastyDeck();

        this.game.addMessage('{0} has mulliganed {1} cards from the dynasty deck', this.name, cards.length);
    }

    dynastyKeep() {
        this.game.addMessage('{0} has kept all dynasty cards', this.name);
        this.takenDynastyMulligan = true;
    }

    conflictMulligan(cards) {
        if(this.takenConflictMulligan) {
            return false;
        }

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

    conflictKeep() {
        this.game.addMessage('{0} has kept all conflict cards', this.name);
        this.takenConflictMulligan = true;
        this.readyToStart = true;
    }

    addCostReducer(reducer) {
        this.costReducers.push(reducer);
    }

    removeCostReducer(reducer) {
        if(_.contains(this.costReducers, reducer)) {
            reducer.unregisterEvents();
            this.costReducers = _.reject(this.costReducers, r => r === reducer);
        }
    }

    getReducedCost(playingType, card) {
        var baseCost = card.getCost();
        var matchingReducers = _.filter(this.costReducers, reducer => reducer.canReduce(playingType, card));
        var reducedCost = _.reduce(matchingReducers, (cost, reducer) => cost - reducer.getAmount(card), baseCost);
        return Math.max(reducedCost, 0);
    }

    markUsedReducers(playingType, card) {
        var matchingReducers = _.filter(this.costReducers, reducer => reducer.canReduce(playingType, card));
        _.each(matchingReducers, reducer => {
            reducer.markUsed();
            if(reducer.isExpired()) {
                this.removeCostReducer(reducer);
            }
        });
    }

    registerAbilityMax(cardName, limit) {
        if(this.abilityMaxByTitle[cardName]) {
            return;
        }

        this.abilityMaxByTitle[cardName] = limit;
        limit.registerEvents(this.game);
    }

    isAbilityAtMax(cardName) {
        let limit = this.abilityMaxByTitle[cardName];

        if(!limit) {
            return false;
        }

        return limit.isAtMax();
    }

    incrementAbilityMax(cardName) {
        let limit = this.abilityMaxByTitle[cardName];

        if(limit) {
            limit.increment();
        }
    }

    findAndUseAction(card) {
        if(!card) {
            return false;
        }

        var context = {
            game: this.game,
            player: this,
            source: card
        };

        var actions = _.filter(card.getActions(), action => action.meetsRequirements(context) && action.canPayCosts(context) && action.canResolveTargets(context));

        if(actions.length === 0) {
            return false;
        }

        if(actions.length === 1) {
            this.game.resolveAbility(actions[0], context);
        } else {
            this.game.queueStep(new PlayActionPrompt(this.game, this, actions, context));
        }

        return true;
    }

    canPutIntoPlay(card) {
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

    putIntoPlay(card, intoConflict = false) {
        if(!this.canPutIntoPlay(card)) {
            return;
        }

        // this is deprecated, as this function should never be called for attachments, unless they get dragged into play
        if(card.getType() === 'attachment') {
            this.promptForAttachment(card);
            return;
        }

        let originalLocation = card.location;

        card.new = true;
        this.moveCard(card, 'play area');
        card.controller = this;

        if(intoConflict && this.game.currentConflict && card.allowGameAction('playIntoConflict')) {
            if(this.game.currentConflict.attackingPlayer === this) {
                this.game.currentConflict.addAttacker(card);
            } else {
                this.game.currentConflict.addDefender(card);
            }
        }

        card.applyPersistentEffects();

        this.game.raiseEvent('onCardEntersPlay', { card: card, originalLocation: originalLocation });
    }

    setupBegin() {
        this.firstPlayer = false;
    }

    drawPhase() {
        this.drawPhaseCards = this.honorBid;
        this.game.addMessage('{0} draws {1} cards for the draw phase', this, this.drawPhaseCards);
        this.drawCardsToHand(this.drawPhaseCards);
    }

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

    hasUnmappedAttachments() {
        return this.cardsInPlay.any(card => {
            return card.getType() === 'attachment';
        });
    }

    canAttach(attachment, card) {
        if(!attachment || !card) {
            return false;
        }

        return (
            card.location === 'play area' &&
            card !== attachment &&
            card.allowAttachment(attachment) &&
            attachment.canAttach(this, card)
        );
    }


    attach(attachment, card) {
        if(!card || !attachment) {
            return;
        }

        if(!this.canAttach(attachment, card)) {
            return;
        }

        let originalLocation = attachment.location;
        let originalParent = attachment.parent;

        attachment.owner.removeCardFromPile(attachment);
        if(originalParent) {
            originalParent.removeAttachment(attachment);
        }
        attachment.controller = this;
        attachment.moveTo('play area');
        card.attachments.push(attachment);
        attachment.parent = card;

        this.game.queueSimpleStep(() => {
            attachment.applyPersistentEffects();
        });

        if(attachment.printedKeywords.includes('restricted') && _.size(card.attachments.filter(card => card.isRestricted())) > 1) {
            this.game.promptForSelect(this, {
                activePromptTitle: 'Choose a card to discard',
                waitingPromptTitle: 'Waiting for opponent to choose a card to discard',
                cardCondition: c => c.parent === card && c.isRestricted(),
                onSelect: (player, card) => {
                    player.discardCardFromPlay(card);
                    return true;
                },
                source: 'Too many Restricted attachments'
            });
        }

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

        this.game.raiseAtomicEvent(events);
    }

    showConflictDeck() {
        this.showConflict = true;
    }

    showDynastyDeck() {
        this.showDynasty = true;
    }

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

    beginConflict() {
        this.cardsInPlay.each(card => {
            card.resetForConflict();
        });
    }

    initiateConflict(conflictType) {
        this.conflicts.perform(conflictType);
    }

    winConflict(conflictType, wasAttacker) {
        this.conflicts.won(conflictType, wasAttacker);
    }

    loseConflict(conflictType, wasAttacker) {
        this.conflicts.lost(conflictType, wasAttacker);
    }

    resetForConflict() {
        this.cardsInPlay.each(card => {
            card.resetForConflict();
        });
    }

    sacrificeCard(card) {
        if(card.allowGameAction('sacrifice')) {
            this.game.raiseCardLeavesPlayEvent(card, card.isDynasty ? 'dynasty discard pile' : 'conflict discard pile', true);
        }
    }

    discardCardFromPlay(card) {
        if(card.allowGameAction('discardCardFromPlay')) {
            this.game.raiseCardLeavesPlayEvent(card, card.isDynasty ? 'dynasty discard pile' : 'conflict discard pile', false);
        }
    }

    discardCardsFromHand(cards, atRandom = false) {
        this.game.raiseSimultaneousEvent(cards, {
            eventName: 'onCardsDiscardedFromHand',
            perCardEventName: 'onDiscardFromHand',
            perCardHandler: (params) => {
                this.moveCard(params.card, params.card.isConflict ? 'conflict discard pile' : 'dynasty discard pile');
                this.game.addMessage('{0} discards {1}{2}', this, params.card, atRandom ? ' at random' : '');
            },
            params: {player: this}
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
        });
    }


    returnCardToHand(card) {
        if(card.allowGameAction('returnToHand')) {
            this.game.raiseCardLeavesPlayEvent(card, 'hand', false);
        }
    }

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

        this.totalGloryForFavor = cardGlory + _.size(rings);

        return this.totalGloryForFavor;
    }

    getClaimedRings() {
        return _.filter(this.game.rings, ring => ring.claimedBy === this.name);
    }

    claimImperialFavor(conflictType) {
        this.imperialFavor = conflictType;
    }

    loseImperialFavor() {
        this.imperialFavor = '';
    }

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

    removeAttachment(attachment) {
        this.game.raiseCardLeavesPlayEvent(attachment, 'conflict discard pile');
    }

    selectDeck(deck) {
        this.deck.selected = false;
        this.deck = deck;
        this.deck.selected = true;

        this.stronghold.cardData = deck.stronghold[0];
        this.faction = deck.faction;
    }

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

        if(location === 'play area') {
            if(card.owner !== this) {
                card.owner.moveCard(card, targetLocation, options);
                return;
            }

            if(card.isConflict || card.isDynasty) {
                // In normal play, all attachments should already have been removed, but in manual play we may need to remove them
                card.attachments.each(attachment => {
                    this.removeAttachment(attachment);
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
            if(!card.isStronghold) {
                card.facedown = true;
            }
            if(!this.takenDynastyMulligan && card.isDynasty) {
                card.facedown = false;
            }
            targetPile.push(card);
        } else if(targetLocation === 'conflict deck' && !options.bottom) {
            targetPile.unshift(card);
        } else if(targetLocation === 'dynasty deck' && !options.bottom) {
            targetPile.unshift(card);
        } else if(['conflict discard pile', 'dynasty discard pile'].includes(targetLocation)) {
            targetPile.unshift(card);
            this.game.raiseEvent('onCardPlaced', { card: card, location: targetLocation });
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

    honorCard(card) {
        this.game.raiseEvent('onCardHonored', { player: this, card: card }, () => card.honor());
    }

    dishonorCard(card) {
        this.game.raiseEvent('onCardDishonored', { player: this, card: card }, () => card.dishonor());
    }

    bowCard(card) {
        if(card.bowed) {
            return;
        }

        this.game.applyGameAction('bow', card, card => {
            card.bowed = true;

            this.game.raiseEvent('onCardBowed', { player: this, card: card });
        });
    }

    readyCard(card) {
        if(!card.bowed) {
            return;
        }

        this.game.applyGameAction('ready', card, card => {
            card.bowed = false;

            this.game.raiseEvent('onCardStood', { player: this, card: card });
        });
    }

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

    getTotalIncome() {
        return this.stronghold.cardData.fate;
    }

    getTotalHonor() {
        return this.honor;
    }

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

    passDynasty() {
        this.passedDynasty = true;
    }

    setShowBid() {
        this.showBid = this.honorBid;
        this.game.addMessage('{0} reveals a bid of {1}', this, this.showBid);
    }

    resolveRingEffects(elements, queue = []) {
        if(!_.isArray(elements)) {
            this.resolveRingEffectForElement(elements);
            return;
        } else if(elements.length === 1) {
            queue.push(elements[0]);
            if(queue.length > 1) {
                this.game.addMessage('{0} chooses that the rings will resolve in the following order: {1}', this.game.getFirstPlayer(), queue);
            }
            _.each(queue, element => this.game.queueSimpleStep(() => this.resolveRingEffectForElement(element)));
            return;
        } 
        let handlers = _.map(elements, element => {
            return () => {
                queue.push(element);
                this.game.queueSimpleStep(() => this.resolveRingEffects(_.without(elements, element), queue));
            };
        });
        this.game.promptWithHandlerMenu(this.game.getFirstPlayer(), {
            activePromptTitle: 'Choose ring resolution order',
            source: 'Ring resolution order',
            choices: elements,
            handlers: handlers
        });
    }
    
    resolveRingEffectForElement(element) {
        this.game.queueSimpleStep(() => this.game.pushAbilityContext('ring', element, 'effect'));
        this.game.queueSimpleStep(() => this.resolveRing(element));
        this.game.queueSimpleStep(() => this.game.popAbilityContext());
    }
    
    resolveRing(element) {
        if(element === '') {
            return;
        }

        let otherPlayer = this.game.getOtherPlayer(this);

        switch(element) {
            case 'air':
                this.game.promptWithMenu(this, this, {
                    activePrompt: {
                        promptTitle: 'Air Ring',
                        menuTitle: 'Choose an effect to resolve',
                        buttons: [
                            { text: 'Gain 2 Honor', arg: 'Gain 2 Honor', method: 'resolveAirRing' },
                            { text: 'Take 1 Honor from Opponent', arg: 'Take 1 Honor from Opponent', method: 'resolveAirRing' }
                        ]
                    },
                    waitingPromptTitle: 'Waiting for opponent to use Air Ring'
                });
                break;
            case 'earth':
                this.drawCardsToHand(1);
                if(otherPlayer) {
                    otherPlayer.discardAtRandom(1);
                }
                break;
            case 'void':
                this.game.promptForSelect(this, {
                    activePromptTitle: 'Choose character to remove a Fate from',
                    waitingPromptTitle: 'Waiting for opponent to use Void Ring',
                    cardCondition: card => {
                        return (card.location === 'play area' && card.fate > 0);
                    },
                    cardType: 'character',
                    onSelect: (player, card) => {
                        card.modifyFate(-1);
                        return true;
                    }
                });
                break;
            case 'water':
                this.game.promptForSelect(this, {
                    activePromptTitle: 'Choose character to bow or unbow',
                    waitingPromptTitle: 'Waiting for opponent to use Water Ring',
                    cardCondition: card => {
                        return ((card.fate === 0 || card.bowed) && card.location === 'play area');
                    },
                    cardType: 'character',
                    onSelect: (player, card) => {
                        if(card.bowed) {
                            this.readyCard(card);
                        } else {
                            this.bowCard(card);
                        }
                        return true;
                    }
                });
                break;
            case 'fire':
                this.game.promptWithMenu(this, this, {
                    activePrompt: {
                        promptTitle: 'Fire Ring',
                        menuTitle: 'Choose an effect to resolve',
                        buttons: [
                            { text: 'Honor a character', arg: 'honor', method: 'resolveFireRing' },
                            { text: 'Dishonor a character', arg: 'sihonor', method: 'resolveFireRing' }
                        ]
                    },
                    waitingPromptTitle: 'Waiting for opponent to use Fire Ring'
                });
                break;
        }
        this.game.addMessage('{0} resolved the {1} ring', this.name, element);
    }

    resolveAirRing(player, choice) {
        if(choice === 'Gain 2 Honor') {
            this.game.addHonor(this, 2);
        } else {
            if(this.game.getOtherPlayer(this)) {
                this.game.transferHonor(this.game.getOtherPlayer(this), this, 1);
            } else {
                this.game.addHonor(this, 1);
            }
        }
        return true;
    }

    resolveFireRing(player, choice) {
        if(choice === 'honor') {
            this.game.promptForSelect(this, {
                activePromptTitle: 'Choose character to '.concat(choice),
                waitingPromptTitle: 'Waiting for opponent to use Fire Ring',
                cardCondition: card => !card.isHonored && card.location === 'play area',
                cardType: 'character',
                onSelect: (player, card) => {
                    this.honorCard(card);
                    return true;
                }
            });
        } else {
            this.game.promptForSelect(this, {
                activePromptTitle: 'Choose character to '.concat(choice),
                waitingPromptTitle: 'Waiting for opponent to use Fire Ring',
                cardCondition: card => !card.isdishonored && card.location === 'play area',
                cardType: 'character',
                onSelect: (player, card) => {
                    this.dishonorCard(card);
                    return true;
                }
            });
        }
        return true;
    }

    discardCharactersWithNoFate() {
        _.each(this.filterCardsInPlay(card => card.type === 'character' && card.fate === 0), character => {
            this.discardCardFromPlay(character);
        });
    }

    getStats() {
        return {
            fate: this.fate,
            honor: this.getTotalHonor()
        };
    }

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
            disconnected: this.disconnected,
            faction: this.faction,
            firstPlayer: this.firstPlayer,
            id: this.id,
            keywordSettings: this.keywordSettings,
            imperialFavor: this.imperialFavor,
            left: this.left,
            name: this.name,
            numConflictCards: this.conflictDeck.size(),
            numDynastyCards: this.dynastyDeck.size(),
            numProvinceCards: this.provinceDeck.size(),
            phase: this.game.currentPhase,
            promptedActionWindows: this.promptedActionWindows,
            provinces: {
                one: this.getSummaryForCardList(this.provinceOne, activePlayer, !this.takenDynastyMulligan),
                two: this.getSummaryForCardList(this.provinceTwo, activePlayer, !this.takenDynastyMulligan),
                three: this.getSummaryForCardList(this.provinceThree, activePlayer, !this.takenDynastyMulligan),
                four: this.getSummaryForCardList(this.provinceFour, activePlayer, !this.takenDynastyMulligan)
            },
            showBid: this.showBid,
            stats: this.getStats(),
            stronghold: this.stronghold.getSummary(activePlayer),
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

        return _.extend(state, promptState);
    }
}

module.exports = Player;
