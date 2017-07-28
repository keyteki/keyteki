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
        this.takenMulligan = false;
        this.dynastyStep;
        this.passedDynasty = false;
        this.drawBid = 0;
        this.duelBid = 0;
        this.showBid = 0;
        

        this.deck = {};
        this.conflicts = new ConflictTracker();
        this.minReserve = 0;
        this.costReducers = [];
        this.playableLocations = _.map(['dynasty', 'play'], playingType => new PlayableLocation(playingType, this, 'hand'));
        this.cannotGainConflictBonus = false;
        this.cannotTriggerCardAbilities = false;
        this.promptedActionWindows = user.promptedActionWindows || {
            dynasty: false,
            draw: false,
            conflictBegin: false,
            attackersDeclared: true,
            defendersDeclared: true,
            winnerDetermined: true,
            fate: false,
            regroup: false
        };

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

    findCardByUuidInAnyList(uuid) {
        return this.findCardByUuid(this.allCards, uuid);
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

    attachStronghold(){
        this.moveCard(this.stronghold, 'stronghold province');
    }

    fillProvinces(){
        var provinces = ['province 1', 'province 2', 'province 3', 'province 4'];
        _.each(provinces, province => {
            if(_.find(this.getSourceList(province), card => { return card.isDynasty })) {
                //Noop              
            } else {
                this.moveCard(this.dynastyDeck.first(), province);
            }
        });
    }

    anyCardsInPlay(predicate) {
        return this.allCards.any(card => card.location === 'play area' && predicate(card));
    }

    filterCardsInPlay(predicate) {
        return this.allCards.filter(card => card.location === 'play area' && predicate(card));
    }

    getNumberOfCardsInPlay(predicate) {
        return this.allCards.reduce((num, card) => {
            if(card.location === 'play area' && predicate(card)) {
                return num + 1;
            }

            return num;
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
            return playCard !== card && (playCard.code === card.code || playCard.name === card.name);
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
        if(numCards > this.conflictDeck.size()) {
            numCards = this.conflictDeck.size();
        }

        var cards = this.conflictDeck.first(numCards);
        _.each(cards, card => {
            this.moveCard(card, 'hand');
        });

        if(this.conflictDeck.size() === 0) {
            this.game.playerDecked(this);
        }

        return (cards.length > 1) ? cards : cards[0];
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
        var cards = this.dynastyDrawDeck;

        if(_.isFunction(limit)) {
            predicate = limit;
        } else {
            if(limit > 0) {
                cards = _(this.dynastyDrawDeck.first(limit));
            } else {
                cards = _(this.dynastyDrawDeck.last(-limit));
            }
        }

        return cards.filter(predicate);
    }

    shuffleConflictDeck() {
        this.conflictDeck = _(this.conflictDeck.shuffle());
    }

    shuffleDynastyDeck() {
        this.dynastyDeck = _(this.dynastyDeck.shuffle());
    }


    discardFromConflict(number, callback = () => true) {
        number = Math.min(number, this.conflictDeck.size());

        var cards = this.conflictDeck.first(number);
        this.discardCards(cards, false, discarded => {
            callback(discarded);
            if(this.conflictDeck.size() === 0) {
                var otherPlayer = this.game.getOtherPlayer(this);

                if(otherPlayer) {
                    this.game.addMessage('{0}\'s conflict deck is empty', this);
                    this.game.addMessage('{0} wins the game', otherPlayer);
                }
            }
        });
    }

    moveFromTopToBottomOfConflictDrawDeck(number) {
        while(number > 0) {
            this.moveCard(this.conflictDeck.first(), 'conflict deck', { bottom: true });

            number--;
        }
    }

    discardAtRandom(number, callback = () => true) {
        var toDiscard = Math.min(number, this.hand.size());
        var cards = [];

        while(cards.length < toDiscard) {
            var cardIndex = _.random(0, this.hand.size() - 1);

            var card = this.hand.value()[cardIndex];
            if(!cards.includes(card)) {
                cards.push(card);
            }
        }

        this.discardCards(cards, false, discarded => {
            this.game.addMessage('{0} discards {1} at random', this, discarded);
            callback(discarded);
        });
    }

    canInitiateConflict(conflictType) {
        return !this.conflicts.isAtMax(conflictType);
    }

    canSelectAsFirstPlayer(player) {
        if(this.firstPlayerSelectCondition) {
            return this.firstPlayerSelectCondition(player);
        }

        return true;
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
        this.hand.each(card => {
            card.moveTo('conflict deck');
            this.conflictDeck.push(card);
        });
        this.hand = _([]);
        this.shuffleConflictDeck();
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
        this.conflictDeck = _(preparedDeck.conflictCards);
        this.dynastyDeck = _(preparedDeck.dynastyCards);
        this.allCards = _(preparedDeck.allCards);
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
        this.game.raiseEvent('onStatChanged', this, 'honor');
    }

    mulligan() {
        if(this.takenMulligan) {
            return false;
        }

        this.initConflictDeck();
        this.initDynastyDeck();
        this.takenMulligan = true;
        this.readyToStart = true;

        return true;
    }

    keep() {
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

    playCard(card) {
        if(!card) {
            return false;
        }

        var context = {
            game: this.game,
            player: this,
            source: card
        };
        var playActions = _.filter(card.getPlayActions(), action => action.meetsRequirements(context) && action.canPayCosts(context) && action.canResolveTargets(context));

        if(playActions.length === 0) {
            return false;
        }

        if(playActions.length === 1) {
            this.game.resolveAbility(playActions[0], context);
        } else {
            this.game.queueStep(new PlayActionPrompt(this.game, this, playActions, context));
        }

        return true;
    }

    canPutIntoPlay(card) {
        var owner = card.owner;
        return true;
    }

    canResurrect(card) {
        return this.deadPile.includes(card) && (!card.isUnique() || this.deadPile.filter(c => c.name === card.name).length === 1);
    }

    putIntoPlay(card, playingType = 'play') {
        if(!this.canPutIntoPlay(card)) {
            return;
        }

        var dupeCard = this.getDuplicateInPlay(card);

        if(card.getType() === 'attachment') {
            this.promptForAttachment(card, playingType);
            return;
        }

        if(dupeCard) {
            this.removeCardFromPile(card);
            dupeCard.modifyFate(1);
        } else {
            card.facedown = false;
            if(!dupeCard) {
                card.play(this);
            }

            card.new = true;
            this.moveCard(card, 'play area', { isDupe: !!dupeCard });
            card.controller = this;

            this.game.raiseMergedEvent('onCardEntersPlay', { card: card, playingType: playingType });
        }
    }

    setupDone() {
        if(this.hand.size() < StartingHandSize) {
            this.drawCardsToHand(StartingHandSize - this.hand.size());
        }

        //this.cardsInPlay = processedCards;
        this.fate = 0;
    }

    startPlotPhase() {
        this.firstPlayer = false;
        this.selectedPlot = undefined;
        this.roundDone = false;

        if(this.resetTimerAtEndOfRound) {
            this.noTimer = false;
        }

        this.conflicts.reset();

        this.conflictrLimit = 0;
        this.drawPhaseCards = DrawPhaseCards;

        this.cardsInPlay.each(card => {
            card.new = false;
        });
    }

    flipPlotFaceup() {
        if(this.activePlot) {
            var previousPlot = this.removeActivePlot('revealed plots');
            this.game.raiseEvent('onPlotDiscarded', this, previousPlot);
        }

        this.selectedPlot.flipFaceup();
        this.selectedPlot.play();
        this.moveCard(this.selectedPlot, 'active plot');

        this.game.raiseMergedEvent('onCardEntersPlay', { card: this.activePlot, playingType: 'plot' });

        this.selectedPlot = undefined;
    }

    recyclePlots() {
        if(this.plotDeck.isEmpty()) {
            this.plotDiscard.each(plot => {
                this.moveCard(plot, 'plot deck');
            });
        }
    }

    removeActivePlot(targetLocation) {
        if(this.activePlot) {
            var plot = this.activePlot;
            this.moveCard(this.activePlot, targetLocation);
            this.activePlot = undefined;
            return plot;
        }
    }

    drawPhase() {
        this.drawPhaseCards = this.drawBid;
        this.game.addMessage('{0} draws {1} cards for the draw phase', this, this.drawPhaseCards);
        this.drawCardsToHand(this.drawPhaseCards);
    }

    beginDynasty() {
        this.game.addFate(this, this.getTotalIncome());

        this.game.raiseMergedEvent('onIncomeCollected', { player: this });

        this.limitedPlayed = 0;
    }

    hasUnmappedAttachments() {
        return this.cardsInPlay.any(card => {
            return card.getType() === 'attachment';
        });
    }

    canAttach(attachmentId, card) {
        var attachment = this.findCardByUuidInAnyList(attachmentId);

        if(!attachment) {
            return false;
        }

        if(card.location !== 'play area') {
            return false;
        }

        if(card === attachment) {
            return false;
        }

        return attachment.canAttach(this, card);
    }

    attach(player, attachment, cardId, playingType) {
        var card = this.findCardInPlayByUuid(cardId);

        if(!card || !attachment) {
            return;
        }

        attachment.owner.removeCardFromPile(attachment);

        attachment.parent = card;
        attachment.moveTo('play area');
        this.game.raiseMergedEvent('onCardEntersPlay', { card: attachment, playingType: playingType });
        card.attachments.push(attachment);

        attachment.attach(player, card);
    }

    showConflictDeck() {
        this.showConflict = true;
    }

    showDynastyDeck() {
        this.showDynasty = true;
    }

    isValidDropCombination(source, target) {
        if(source === 'province deck' && !_.isEmpty(_.intersection(['stronghold province', 'province 1', 'province 2', 'province 3', 'province 4'], target))) {
            return false;
        }

        if(target === 'province deck' && !_.isEmpty(_.intersection(['stronghold province', 'province 1', 'province 2', 'province 3', 'province 4'], source))) {
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
        if(!this.isValidDropCombination(source, target)) {
            return false;
        }

        var sourceList = this.getSourceList(source);
        var card = this.findCardByUuid(sourceList, cardId);

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
        } else {
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
        this.game.applyGameAction('sacrifice', card, card => {
            this.game.raiseMergedEvent('onSacrificed', { player: this, card: card }, () => {
                this.moveCard(card, 'discard pile');
            });
        });
    }

    discardCard(card, allowSave = true) {

        this.discardCards([card], allowSave);
    }

    discardCards(cards, allowSave = true, callback = () => true) {
        this.game.applyGameAction('discard', cards, cards => {
            var params = {
                player: this,
                cards: cards,
                allowSave: allowSave,
                originalLocation: cards[0].location
            };
            this.game.raiseMergedEvent('onCardsDiscarded', params, event => {
                _.each(event.cards, card => {
                    this.doSingleCardDiscard(card, allowSave);
                });
                this.game.queueSimpleStep(() => {
                    callback(event.cards);
                });
            });
        });
    }

    doSingleCardDiscard(card, allowSave = true) {
        var params = {
            player: this,
            card: card,
            allowSave: allowSave,
            originalLocation: card.location
        };
        this.game.raiseMergedEvent('onCardDiscarded', params, event => {
            if(event.card.isConflict) {
                this.moveCard(event.card, 'conflict discard pile');
            } else if (event.card.isDynasty) {
                this.moveCard(event.card, 'dynasty discard pile');
            }
        });
    }


    returnCardToHand(card, allowSave = true) {
        this.game.applyGameAction('returnToHand', card, card => {
            if(!card.dupes.isEmpty() && allowSave) {
                if(!this.removeDuplicate(card)) {
                    this.moveCard(card, 'hand');
                } else {
                    this.game.addMessage('{0} discards a duplicate to save {1}', this, card);
                }
            } else {
                this.moveCard(card, 'hand');
            }
        });
    }

    /**
     * @deprecated Use `Game.killCharacter` instead.
     */
    killCharacter(card, allowSave = true) {
        this.game.killCharacter(card, allowSave);
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

        return cardGlory;
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

    removeAttachment(attachment, allowSave = true) {

        if(attachment.isAncestral()) {
            attachment.owner.moveCard(attachment, 'hand');
        } else {
            attachment.owner.moveCard(attachment, 'conflict discard pile');
        }
    }

    selectDeck(deck) {
        this.deck.selected = false;
        this.deck = deck;
        this.deck.selected = true;

        this.stronghold.cardData = deck.stronghold[0];
        /* Do more with this later
        this.faction.cardData = deck.faction;
        this.faction.cardData.name = deck.faction.name;
        this.faction.cardData.code = deck.faction.value;
        this.faction.cardData.type_code = 'faction';
        this.faction.cardData.strength = 0;
        */
    }

    moveCard(card, targetLocation, options = {}) {

        this.removeCardFromPile(card);

        var targetPile = this.getSourceList(targetLocation);

        if(!targetPile || targetPile.contains(card)) {
            return;
        }

        if(card.location === 'play area') {
            if(card.owner !== this) {
                card.owner.moveCard(card, targetLocation);
                return;
            }

            card.attachments.each(attachment => {
                this.removeAttachment(attachment, false);
            });

            /* Ignore dupe mechanic
            while(card.dupes.size() > 0 && targetLocation !== 'play area') {
                this.removeDuplicate(card, true);
            }
            */
           
            var params = {
                player: this,
                card: card
            };

            this.game.raiseMergedEvent('onCardLeftPlay', params, event => {
                event.card.leavesPlay();

                if(event.card.parent && event.card.parent.attachments) {
                    event.card.parent.attachments = this.removeCardByUuid(event.card.parent.attachments, event.card.uuid);
                    event.card.parent = undefined;
                }

                card.moveTo(targetLocation);
            });
        }

        if(card.location === 'province') {
            card.leavesPlay();
            this.game.raiseMergedEvent('onCardLeftPlay', { player: this, card: card });
        }

        if(card.location !== 'play area') {
            card.moveTo(targetLocation);
        }

        if(['province 1', 'province 2', 'province 3', 'province 4', 'stronghold province'].includes(targetLocation)) {
            if(!card.isStronghold) {
                card.facedown = true;
            }
            targetPile.push(card);
        } else if(targetLocation === 'conflict deck' && !options.bottom) {
            targetPile.unshift(card);
        } else if(targetLocation === 'dynasty deck' && !options.bottom) {
            targetPile.unshift(card);
        } else {
            targetPile.push(card);
        }

        if(['conflict discard pile', 'dynasty discard pile'].includes(targetLocation)) {
            this.game.raiseMergedEvent('onCardPlaced', { card: card, location: targetLocation });
        }
    }

    bowCard(card) {
        if(card.bowed) {
            return;
        }

        this.game.applyGameAction('bow', card, card => {
            card.bowed = true;

            this.game.raiseMergedEvent('onCardBowed', { player: this, card: card });
        });
    }

    readyCard(card) {
        if(!card.bowed) {
            return;
        }

        this.game.applyGameAction('ready', card, card => {
            card.bowed = false;

            this.game.raiseMergedEvent('onCardStood', { player: this, card: card });
        });
    }

    removeCardFromPile(card) {
        if(card.controller !== this) {
            let oldController = card.controller;
            oldController.removeCardFromPile(card);

            oldController.allCards = _(oldController.allCards.reject(c => c === card));
            this.allCards.push(card);
            card.controller = card.owner;

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

    setDrawBid(bid) {
        this.drawBid = bid;
    }

    getState(activePlayer) {
        let isActivePlayer = activePlayer === this;
        let promptState = isActivePlayer ? this.promptState.getState() : {};
        let state = {
            additionalPiles: _.mapObject(this.additionalPiles, pile => ({
                title: pile.title,
                area: pile.area,
                isPrivate: pile.isPrivate,
                cards: this.getSummaryForCardList(pile.cards, activePlayer, pile.isPrivate)
            })),
            promptedActionWindows: this.promptedActionWindows,
            cardsInPlay: this.getSummaryForCardList(this.cardsInPlay, activePlayer),
            conflictDeck: this.getSummaryForCardList(this.conflictDeck, activePlayer),
            dynastyDeck: this.getSummaryForCardList(this.dynastyDeck, activePlayer),
            conflictDiscardPile: this.getSummaryForCardList(this.conflictDiscardPile, activePlayer),
            dynastyDiscardPile: this.getSummaryForCardList(this.dynastyDiscardPile, activePlayer),
            disconnected: this.disconnected,
            faction: this.faction,
            stronghold: this.stronghold.getSummary(activePlayer),
            firstPlayer: this.firstPlayer,
            fate: this.fate,
            hand: this.getSummaryForCardList(this.hand, activePlayer, true),
            id: this.id,
            left: this.left,
            numConflictCards: this.conflictDeck.size(),
            numDynastyCards: this.dynastyDeck.size(),
            name: this.name,
            numProvinceCards: this.provinceDeck.size(),
            phase: this.phase,
            provinceDeck: this.getSummaryForCardList(this.provinceDeck, activePlayer, true),
            provinces: {
                one: this.getSummaryForCardList(this.provinceOne, activePlayer),
                two: this.getSummaryForCardList(this.provinceTwo, activePlayer),
                three: this.getSummaryForCardList(this.provinceThree, activePlayer),
                four: this.getSummaryForCardList(this.provinceFour, activePlayer)
            },
            showBid: this.showBid,
            strongholdProvince: this.getSummaryForCardList(this.strongholdProvince, activePlayer),
            totalHonor: this.getTotalHonor(),
            user: _.omit(this.user, ['password', 'email'])
        };

        if(this.showConflictDeck) {
            state.showConflictDeck = true;
            state.conflictDeck = this.getSummaryForCardList(this.conflictDeck, activePlayer);
        }

        if(this.showDynastyDeck) {
            state.showDynastyDeck = true;
            state.dynastyDeck = this.getSummaryForCardList(this.dynastyDeck, activePlayer);
        }

        return _.extend(state, promptState);
    }
}

module.exports = Player;
