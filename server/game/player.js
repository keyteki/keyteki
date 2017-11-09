const _ = require('underscore');

const Spectator = require('./spectator.js');
const Deck = require('./deck.js');
const AbilityContext = require('./AbilityContext.js');
const AttachmentPrompt = require('./gamesteps/attachmentprompt.js');
const ConflictTracker = require('./conflicttracker.js');
const LeavesPlayEvent = require('./Events/LeavesPlayEvent.js');
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
        this.stronghold = null;
        this.role = null;

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
        this.conflictDeckTopCardHidden = true;
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
        this.optionSettings = user.settings.optionSettings;

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
                card.facedown = false;
            } else {
                this.moveCard(this.dynastyDeck.first(), province);
                card = this.getDynastyCardInProvince(province);
                card.facedown = false;
            }
        });
    }
    
    flipDynastyCards() {
        let revealedCards = [];
        _.each(['province 1', 'province 2', 'province 3', 'province 4'], province => {
            let card = this.getDynastyCardInProvince(province);
            if(card && card.facedown) {
                card.facedown = false;
                revealedCards.push(card);
            }
        });
        if(revealedCards.length > 0) {
            this.game.addMessage('{0} reveals {1}', this, revealedCards);
        }
    }
    
    getDynastyCardInProvince(location) {
        let province = this.getSourceList(location);
        return province.find(card => card.isDynasty);
    }

    getProvinceCardInProvince(location) {
        let province = this.getSourceList(location);
        return province.find(card => card.isProvince);
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
        if(!this.name === 'Dummy Player') {
            this.game.addMessage('{0} is shuffling their conflict deck', this);
        }
        this.game.raiseEvent('onDeckShuffled', { player: this, deck: 'conflict deck' });
        this.conflictDeck = _(this.conflictDeck.shuffle());
    }

    shuffleDynastyDeck() {
        if(!this.name === 'Dummy Player') {
            this.game.addMessage('{0} is shuffling their dynasty deck', this);
        }
        this.game.raiseEvent('onDeckShuffled', { player: this, deck: 'dynasty deck' });
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
        this.game.openEventWindow(new LeavesPlayEvent({ card: card, destination: card.isDynasty ? 'dynasty deck' : 'conflict deck'}));
    }
    
    moveCardToBottomOfDeck(card) {
        this.game.openEventWindow(new LeavesPlayEvent({ card: card, destination: card.isDynasty ? 'dynasty deck bottom' : 'conflict deck bottom' }));
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

    addCostReducer(reducer) {
        this.costReducers.push(reducer);
    }

    removeCostReducer(reducer) {
        if(_.contains(this.costReducers, reducer)) {
            reducer.unregisterEvents();
            this.costReducers = _.reject(this.costReducers, r => r === reducer);
        }
    }

    getReducedCost(playingType, card, target = null) {
        var baseCost = card.getCost();
        var matchingReducers = _.filter(this.costReducers, reducer => reducer.canReduce(playingType, card, target));
        var reducedCost = _.reduce(matchingReducers, (cost, reducer) => cost - reducer.getAmount(card), baseCost);
        return Math.max(reducedCost, 0);
    }

    markUsedReducers(playingType, card, target = null) {
        var matchingReducers = _.filter(this.costReducers, reducer => reducer.canReduce(playingType, card, target));
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

    canPutIntoPlay(card, inConflict = false) {
        if(inConflict && (!this.game.currentConflict ||
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

    putIntoPlay(card, intoConflict = false, raiseCardPlayed = false) {
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

        let events = [{
            name: 'onCardEntersPlay',
            params: { card: card, originalLocation: originalLocation }
        }];

        if(raiseCardPlayed) {
            events.push({
                name: 'onCardPlayed',
                params: { player: this, card: card, originalLocation: originalLocation }
            });
        }

        this.game.raiseMultipleEvents(events);
    }

    setupBegin() {
        this.firstPlayer = false;
        this.opponent = this.game.getOtherPlayer(this);
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
            attachment.canAttach(card)
        );
    }


    attach(attachment, card, raiseCardPlayed = false) {
        if(!card || !attachment) {
            return;
        }

        attachment.controller = this;
        if(!this.canAttach(attachment, card)) {
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
    
    isAttackingPlayer() {
        return this.game.currentConflict && this.game.currentConflict.attackingPlayer === this;
    }

    isDefendingPlayer() {
        return this.game.currentConflict && this.game.currentConflict.defendingPlayer === this;
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
            this.game.openEventWindow(new LeavesPlayEvent({ card: card, destination: card.isDynasty ? 'dynasty discard pile' : 'conflict discard pile' }, true));
        }
    }

    discardCardFromPlay(card) {
        if(card.allowGameAction('discardCardFromPlay')) {
            this.game.openEventWindow(new LeavesPlayEvent({ card: card, destination: card.isDynasty ? 'dynasty discard pile' : 'conflict discard pile' }, false));
        }
    }

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
        });
    }


    returnCardToHand(card) {
        if(card.allowGameAction('returnToHand')) {
            this.game.openEventWindow(new LeavesPlayEvent({ card: card, destination: 'hand' }));
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
        this.game.openEventWindow(new LeavesPlayEvent({ card: attachment, destination: 'conflict discard pile' }));
    }

    selectDeck(deck) {
        this.deck.selected = false;
        this.deck = deck;
        this.deck.selected = true;
        if(deck.stronghold.length > 0) {
            this.stronghold = new StrongholdCard(this, deck.stronghold[0]);
        }
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

        if(location === 'play area' || (card.type === 'holding' && ['province 1', 'province 2', 'province 3', 'province 4'].includes(location))) {
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
            if(['dynasty deck', 'province deck'].includes(location)) {
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
    
    breakProvince(province) {
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
        });
    }

    honorCard(card, source) {
        this.game.raiseEvent('onCardHonored', { player: this, card: card, source: source }, () => card.honor());
    }

    dishonorCard(card, source) {
        this.game.raiseEvent('onCardDishonored', { player: this, card: card, source: source }, () => card.dishonor());
    }

    bowCard(card, source) {
        if(card.bowed) {
            return;
        }

        this.game.applyGameAction('bow', card, card => {
            card.bowed = true;

            this.game.raiseEvent('onCardBowed', { player: this, card: card, source: source });
        });
    }

    readyCard(card, source) {
        if(!card.bowed) {
            return;
        }

        this.game.applyGameAction('ready', card, card => {
            card.bowed = false;

            this.game.raiseEvent('onCardStood', { player: this, card: card, source: source });
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
    
    discardCharactersWithNoFate(cardsToDiscard) {
        if(cardsToDiscard.length === 0) {
            return;
        }
        this.game.promptForSelect(this, {
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
