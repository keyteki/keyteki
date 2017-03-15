const _ = require('underscore');

const Spectator = require('./spectator.js');
const DrawCard = require('./drawcard.js');
const Deck = require('./deck.js');
const AttachmentPrompt = require('./gamesteps/attachmentprompt.js');
const BestowPrompt = require('./gamesteps/bestowprompt.js');
const ChallengeTracker = require('./challengetracker.js');

const StartingHandSize = 7;
const DrawPhaseCards = 2;

class Player extends Spectator {
    constructor(id, user, owner, game) {
        super(id, user);

        this.drawDeck = _([]);
        this.plotDeck = _([]);
        this.plotDiscard = _([]);
        this.hand = _([]);
        this.cardsInPlay = _([]);
        this.deadPile = _([]);
        this.discardPile = _([]);
        this.additionalPiles = {};

        this.faction = new DrawCard(this, {});

        this.owner = owner;
        this.takenMulligan = false;
        this.game = game;

        this.deck = {};
        this.challenges = new ChallengeTracker();
        this.minReserve = 0;
        this.costReducers = [];
        this.usedPlotsModifier = 0;

        this.createAdditionalPile('out of game', { title: 'Out of Game', area: 'player row' });
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

    getDuplicateInPlay(card) {
        if(!card.isUnique()) {
            return undefined;
        }

        return this.findCard(this.cardsInPlay, playCard => {
            return playCard !== card && (playCard.code === card.code || playCard.name === card.name);
        });
    }

    getNumberOfChallengesWon(challengeType) {
        return this.challenges.getWon(challengeType);
    }

    getNumberOfChallengesLost(challengeType) {
        return this.challenges.getLost(challengeType);
    }

    getNumberOfChallengesInitiatedByType(challengeType) {
        return this.challenges.getPerformed(challengeType);
    }

    getNumberOfChallengesInitiated() {
        return this.challenges.complete;
    }

    getNumberOfUsedPlots() {
        return this.plotDiscard.size() + this.usedPlotsModifier;
    }

    modifyUsedPlots(value) {
        this.usedPlotsModifier += value;
        this.game.raiseEvent('onUsedPlotsModified', this);
    }

    modifyClaim(winner, challengeType, claim) {
        claim = this.activePlot.modifyClaim(winner, challengeType, claim);
        this.cardsInPlay.each(card => {
            claim = card.modifyClaim(winner, challengeType, claim);
        });

        return claim;
    }

    drawCardsToHand(numCards) {
        if(numCards > this.drawDeck.size()) {
            numCards = this.drawDeck.size();
        }

        var cards = this.drawDeck.first(numCards);
        _.each(cards, card => {
            this.moveCard(card, 'hand');
        });

        if(this.drawDeck.size() === 0) {
            this.game.playerDecked(this);
        }

        return (cards.length > 1) ? cards : cards[0];
    }

    searchDrawDeck(limit, predicate) {
        var cards = this.drawDeck;

        if(_.isFunction(limit)) {
            predicate = limit;
        } else {
            if(limit > 0) {
                cards = _(this.drawDeck.first(limit));
            } else {
                cards = _(this.drawDeck.last(-limit));
            }
        }

        return cards.filter(predicate);
    }

    shuffleDrawDeck() {
        this.drawDeck = _(this.drawDeck.shuffle());
    }

    discardFromDraw(number, callback = () => true) {
        number = Math.min(number, this.drawDeck.size());

        var cards = this.drawDeck.first(number);
        this.discardCards(cards, false, discarded => {
            callback(discarded);
            if(this.drawDeck.size() === 0) {
                var otherPlayer = this.game.getOtherPlayer(this);

                if(otherPlayer) {
                    this.game.addMessage('{0}\'s draw deck is empty', this);
                    this.game.addMessage('{0} wins the game', otherPlayer);
                }
            }
        });
    }

    moveFromTopToBottomOfDrawDeck(number) {
        while(number > 0) {
            this.moveCard(this.drawDeck.first(), 'draw deck', { bottom: true });

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

    canInitiateChallenge(challengeType) {
        return !this.challenges.isAtMax(challengeType);
    }

    addChallenge(type, number) {
        this.challenges.modifyMaxForType(type, number);
    }

    setMaxChallenge(number) {
        this.challenges.setMax(number);
    }

    clearMaxChallenge() {
        this.challenges.clearMax();
    }

    setMaxChallengeForType(type, number) {
        this.challenges.setMaxForType(type, number);
    }

    clearMaxChallengeForType(type) {
        this.challenges.clearMaxForType(type);
    }

    initDrawDeck() {
        this.hand.each(card => {
            card.moveTo('draw deck');
            this.drawDeck.push(card);
        });
        this.hand = _([]);
        this.shuffleDrawDeck();
        this.drawCardsToHand(StartingHandSize);
    }

    prepareDecks() {
        var deck = new Deck(this.deck);
        var preparedDeck = deck.prepare(this);
        this.plotDeck = _(preparedDeck.plotCards);
        this.agenda = preparedDeck.agenda;
        this.faction = preparedDeck.faction;
        this.drawDeck = _(preparedDeck.drawCards);
        this.allCards = _(preparedDeck.allCards);
    }

    initialise() {
        this.prepareDecks();
        this.initDrawDeck();

        this.gold = 0;
        this.readyToStart = false;
        this.limitedPlayed = 0;
        this.maxLimited = 1;
        this.activePlot = undefined;
    }

    startGame() {
        if(!this.readyToStart) {
            return;
        }

        this.gold = 8;
    }

    mulligan() {
        if(this.takenMulligan) {
            return false;
        }

        this.initDrawDeck();
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
        var baseCost = playingType === 'ambush' ? card.getAmbushCost() : card.getCost();
        var matchingReducers = _.filter(this.costReducers, reducer => reducer.canReduce(playingType, card));
        var reducedCost = _.reduce(matchingReducers, (cost, reducer) => cost - reducer.amount, baseCost);
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

    getPlayingType(card, forcePlay) {
        if(card.getType() === 'event') {
            return 'play';
        } else if(forcePlay) {
            return 'putIntoPlay';
        } else if(this.game.currentPhase === 'challenge') {
            return 'ambush';
        } else if(this.game.currentPhase === 'marshal') {
            return 'marshal';
        } else if(this.game.currentPhase === 'setup') {
            return 'setup';
        }

        return 'none';
    }

    canPlayCard(card, overrideHandCheck = false) {
        if(this.phase !== 'setup' && this.phase !== 'marshal' && card.getType() !== 'event') {
            if(this.phase !== 'challenge' || !card.isAmbush()) {
                return false;
            }
        }

        if(card.getType() !== 'event' && this.phase === 'marshal' && card.cannotMarshal) {
            return false;
        }

        if(!this.isCardUuidInList(this.hand, card) && !overrideHandCheck) {
            return false;
        }

        var dupe = this.getDuplicateInPlay(card);

        var playingType = this.getPlayingType(card, false);
        var cost = (dupe && playingType !== 'ambush') ? 0 : this.getReducedCost(playingType, card);
        if(cost > this.gold) {
            return false;
        }

        if(this.limitedPlayed >= this.maxLimited && card.isLimited()) {
            return false;
        }

        if(card.getType() === 'character' && card.isUnique()) {
            if(this.isCardNameInList(this.deadPile, card)) {
                return false;
            }
        }

        return true;
    }

    playCard(card, forcePlay, overrideHandCheck = false) {
        if(!card) {
            return false;
        }
        var context = {
            game: this.game,
            player: this,
            source: card
        };
        var playAction = _.find(card.getPlayActions(), action => action.meetsRequirements(context) && action.canPayCosts(context));
        if(playAction) {
            this.game.resolveAbility(playAction, context);
            return true;
        }

        // TODO: These are implemented via play actions now. Once everything is
        // converted, this guard will not be necessary.
        if(card.getType() === 'event' || this.game.currentPhase === 'setup') {
            return false;
        }

        var playingType = this.getPlayingType(card, forcePlay);
        var dupeCard = this.getDuplicateInPlay(card);
        var cost = (dupeCard && playingType !== 'ambush' || forcePlay) ? 0 : this.getReducedCost(playingType, card);

        if(!forcePlay && !this.canPlayCard(card, overrideHandCheck)) {
            return false;
        }

        this.gold -= cost;

        this.markUsedReducers(playingType, card);

        if(this.phase === 'marshal') {
            this.game.addMessage('{0} {1} {2} costing {3}', this, dupeCard ? 'duplicates' : 'marshals', card, cost);
        } else if(card.isAmbush() && this.phase === 'challenge') {
            this.game.addMessage('{0} ambushes with {1} costing {2}', this, card, cost);
        }

        this.putIntoPlay(card, playingType);

        if(card.isLimited() && !forcePlay) {
            this.limitedPlayed++;
        }

        return true;
    }

    putIntoPlay(card, playingType = 'play') {
        var dupeCard = this.getDuplicateInPlay(card);

        if(card.getType() === 'attachment' && playingType !== 'setup' && !dupeCard) {
            this.promptForAttachment(card);
            return;
        }

        if(dupeCard && playingType !== 'setup') {
            this.removeCardFromPile(card);
            dupeCard.addDuplicate(card);
        } else {
            card.facedown = this.game.currentPhase === 'setup';
            if(!dupeCard) {
                card.play(this, playingType === 'ambush');
            }

            card.new = true;
            this.moveCard(card, 'play area', { isDupe: !!dupeCard });
            card.controller = this;

            this.game.raiseEvent('onCardEntersPlay', card);

            if(this.game.currentPhase !== 'setup' && card.isBestow()) {
                this.game.queueStep(new BestowPrompt(this.game, this, card));
            }
        }
    }

    setupDone() {
        if(this.hand.size() < StartingHandSize) {
            this.drawCardsToHand(StartingHandSize - this.hand.size());
        }

        var processedCards = _([]);

        this.cardsInPlay.each(card => {
            card.facedown = false;

            if(!card.isUnique()) {
                processedCards.push(card);
                return;
            }

            var duplicate = this.findCardByName(processedCards, card.name);

            if(duplicate) {
                duplicate.addDuplicate(card);
            } else {
                processedCards.push(card);
            }

        });

        this.cardsInPlay = processedCards;
        this.gold = 0;
    }

    startPlotPhase() {
        this.firstPlayer = false;
        this.selectedPlot = undefined;
        this.roundDone = false;

        this.challenges.reset();

        this.challengerLimit = 0;
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

        if(this.plotDeck.isEmpty()) {
            this.plotDiscard.each(plot => {
                this.moveCard(plot, 'plot deck');
            });

            this.game.raiseEvent('onPlotsRecycled', this);
        }

        this.game.raiseEvent('onCardEntersPlay', this.activePlot);

        this.selectedPlot = undefined;
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
        this.game.addMessage('{0} draws {1} cards for the draw phase', this, this.drawPhaseCards);
        this.drawCardsToHand(this.drawPhaseCards);
    }

    beginMarshal() {
        this.game.addGold(this, this.getTotalIncome());

        this.game.raiseEvent('onIncomeCollected', this);

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

    attach(player, attachment, cardId) {
        var card = this.findCardInPlayByUuid(cardId);

        if(!card || !attachment) {
            return;
        }

        attachment.owner.removeCardFromPile(attachment);

        attachment.parent = card;
        attachment.moveTo('play area');
        this.game.raiseEvent('onCardEntersPlay', attachment);
        card.attachments.push(attachment);

        attachment.attach(player, card);
    }

    showDrawDeck() {
        this.showDeck = true;
    }

    isValidDropCombination(source, target) {
        if(source === 'plot deck' && target !== 'revealed plots') {
            return false;
        }

        if(source === 'revealed plots' && target !== 'plot deck') {
            return false;
        }

        if(target === 'plot deck' && source !== 'revealed plots') {
            return false;
        }

        if(target === 'revealed plots' && source !== 'plot deck') {
            return false;
        }

        return source !== target;
    }

    getSourceList(source) {
        switch(source) {
            case 'hand':
                return this.hand;
            case 'draw deck':
                return this.drawDeck;
            case 'discard pile':
                return this.discardPile;
            case 'dead pile':
                return this.deadPile;
            case 'play area':
                return this.cardsInPlay;
            case 'active plot':
                return _([]);
            case 'plot deck':
                return this.plotDeck;
            case 'revealed plots':
                return this.plotDiscard;
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
            case 'draw deck':
                this.drawDeck = targetList;
                break;
            case 'discard pile':
                this.discardPile = targetList;
                break;
            case 'dead pile':
                this.deadPile = targetList;
                break;
            case 'play area':
                this.cardsInPlay = targetList;
                break;
            case 'plot deck':
                this.plotDeck = targetList;
                break;
            case 'revealed plots':
                this.plotDiscard = targetList;
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

        if(target === 'dead pile' && card.getType() !== 'character') {
            return false;
        }

        if(target === 'play area' && card.getType() === 'event') {
            return false;
        }

        if(target === 'play area') {
            this.putIntoPlay(card);
        } else {
            if(target === 'dead pile' && card.location === 'play area') {
                this.killCharacter(card, false);
                return true;
            }

            if(target === 'discard pile') {
                this.discardCard(card, false);
                return true;
            }

            this.moveCard(card, target);
        }

        return true;
    }

    promptForAttachment(card) {
        // TODO: Really want to move this out of here.
        this.game.queueStep(new AttachmentPrompt(this.game, this, card));
    }

    beginChallenge() {
        this.cardsInPlay.each(card => {
            card.resetForChallenge();
        });
        this.selectCard = false;
    }

    initiateChallenge(challengeType) {
        this.challenges.perform(challengeType);
    }

    winChallenge(challengeType, wasAttacker) {
        this.challenges.won(challengeType, wasAttacker);
    }

    loseChallenge(challengeType, wasAttacker) {
        this.challenges.lost(challengeType, wasAttacker);
    }

    resetForChallenge() {
        this.cardsInPlay.each(card => {
            card.resetForChallenge();
        });
    }

    sacrificeCard(card) {
        this.game.raiseEvent('onSacrificed', this, card, () => {
            this.moveCard(card, 'discard pile');
        });
    }

    discardCard(card, allowSave = true) {
        if(!card.dupes.isEmpty() && allowSave) {
            if(this.removeDuplicate(card)) {
                this.game.addMessage('{0} discards a duplicate to save {1}', this, card);
                return;
            }
        }

        this.discardCards([card], allowSave);
    }

    discardCards(cards, allowSave = true, callback = () => true) {
        if(cards.length === 0) {
            return;
        }

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
    }

    doSingleCardDiscard(card, allowSave = true) {
        var params = {
            player: this,
            card: card,
            allowSave: allowSave,
            originalLocation: card.location
        };
        this.game.raiseMergedEvent('onCardDiscarded', params, event => {
            this.moveCard(event.card, 'discard pile');
        });
    }

    returnCardToHand(card, allowSave = true) {
        if(!card.dupes.isEmpty() && allowSave) {
            if(!this.removeDuplicate(card)) {
                this.moveCard(card, 'hand');
            } else {
                this.game.addMessage('{0} discards a duplicate to save {1}', this, card);
            }
        } else {
            this.moveCard(card, 'hand');
        }
    }

    killCharacter(card, allowSave = true) {
        var character = this.findCardInPlayByUuid(card.uuid);

        if(!character || character.location !== 'play area') {
            return;
        }

        if(!character.dupes.isEmpty() && allowSave) {
            if(!this.removeDuplicate(character)) {
                this.moveCard(card, 'dead pile');
            } else {
                this.game.addMessage('{0} discards a duplicate to save {1}', this, character);
            }
        } else {
            this.game.raiseEvent('onCharacterKilled', this, character, allowSave, event => {
                if(character.location !== 'play area') {
                    event.cancel();
                    return;
                }

                this.moveCard(card, 'dead pile');
                this.game.addMessage('{0} kills {1}', this, character);
            });
        }
    }

    getDominance() {
        var cardStrength = this.cardsInPlay.reduce((memo, card) => {
            if(!card.kneeled && card.getType() === 'character' && card.contributesToDominance) {
                return memo + card.getStrength();
            }

            return memo;
        }, 0);

        this.cardsInPlay.each(card => {
            cardStrength = card.modifyDominance(this, cardStrength);
        });

        return cardStrength + this.gold;
    }

    standCards(notCharacters = false) {
        this.cardsInPlay.each(card => {
            card.attachments.each(attachment => {
                this.standCard(attachment);
            });

            if(notCharacters && card.getType() === 'character') {
                return;
            }

            this.standCard(card);
        });

        this.faction.kneeled = false;
    }

    taxation() {
        this.gold = 0;
    }

    getTotalPower() {
        var power = this.cardsInPlay.reduce((memo, card) => {
            return memo + card.getPower();
        }, this.faction.power);

        return power;
    }

    removeAttachment(attachment, allowSave = true) {
        while(attachment.dupes.size() > 0) {
            var dupeRemoved = this.removeDuplicate(attachment);
            if(dupeRemoved && allowSave) {
                return;
            }
        }

        if(attachment.isTerminal()) {
            attachment.owner.moveCard(attachment, 'discard pile');
        } else {
            attachment.owner.moveCard(attachment, 'hand');
        }
    }

    selectDeck(deck) {
        this.deck.selected = false;
        this.deck = deck;
        this.deck.selected = true;

        this.faction.cardData = deck.faction;
        this.faction.cardData.code = deck.faction.value;
        this.faction.cardData.type_code = 'faction';
        this.faction.cardData.strength = 0;
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

            while(card.dupes.size() > 0 && targetLocation !== 'play area') {
                this.removeDuplicate(card);
            }

            card.leavesPlay();
            this.game.raiseEvent('onCardLeftPlay', this, card);

            if(card.parent && card.parent.attachments) {
                card.parent.attachments = this.removeCardByUuid(card.parent.attachments, card.uuid);
                card.parent = undefined;
            }
        }

        if(card.location === 'hand') {
            this.game.raiseEvent('onCardLeftHand', card);
        }

        if(card.location === 'active plot') {
            card.leavesPlay();
            this.game.raiseEvent('onCardLeftPlay', this, card);
        }

        card.moveTo(targetLocation);

        if(targetLocation === 'active plot') {
            this.activePlot = card;
        } else if(targetLocation === 'draw deck' && !options.bottom) {
            targetPile.unshift(card);
        } else {
            targetPile.push(card);
        }

        if(targetLocation === 'hand') {
            this.game.raiseEvent('onCardEntersHand', card);
        }
    }

    kneelCard(card) {
        if(!card.kneeled) {
            card.kneeled = true;

            this.game.raiseEvent('onCardKneeled', this, card);
        }
    }

    standCard(card) {
        if(card.kneeled) {
            card.kneeled = false;

            this.game.raiseEvent('onCardStood', this, card);
        }
    }

    removeDuplicate(card) {
        if(card.dupes.isEmpty()) {
            return false;
        }

        var dupe = card.removeDuplicate();
        if(!dupe) {
            return false;
        }

        dupe.moveTo('discard pile');
        dupe.owner.discardPile.push(dupe);
        this.game.raiseEvent('onDupeDiscarded', this, card, dupe);

        return true;
    }

    removeCardFromPile(card) {
        if(card.controller !== this) {
            card.controller.removeCardFromPile(card);

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

    getTotalInitiative() {
        if(!this.activePlot) {
            return 0;
        }

        return this.activePlot.getInitiative();
    }

    getTotalIncome() {
        if(!this.activePlot) {
            return 0;
        }

        return this.activePlot.getIncome();
    }

    getTotalReserve() {
        if(!this.activePlot) {
            return 0;
        }

        return Math.max(this.activePlot.getReserve(), this.minReserve);
    }

    getClaim() {
        return this.activePlot ? this.activePlot.getClaim() : 0;
    }

    isBelowReserve() {
        return this.hand.size() <= this.getTotalReserve();
    }

    getSummaryForCardList(list, isActivePlayer, hideWhenFaceup) {
        return list.map(card => {
            return card.getSummary(isActivePlayer, hideWhenFaceup);
        });
    }

    currentPrompt() {
        return {
            selectCard: this.selectCard,
            menuTitle: this.menuTitle,
            buttons: this.buttons
        };
    }

    setPrompt(prompt) {
        this.selectCard = prompt.selectCard || false;
        this.menuTitle = prompt.menuTitle || '';
        this.buttons = prompt.buttons || [];
    }

    cancelPrompt() {
        this.selectCard = false;
        this.menuTitle = '';
        this.buttons = [];
    }

    getState(isActivePlayer) {
        var state = {
            activePlot: this.activePlot ? this.activePlot.getSummary(isActivePlayer) : undefined,
            additionalPiles: _.mapObject(this.additionalPiles, pile => ({
                title: pile.title,
                area: pile.area,
                isPrivate: pile.isPrivate,
                cards: this.getSummaryForCardList(pile.cards, isActivePlayer, pile.isPrivate)
            })),
            agenda: this.agenda ? this.agenda.getSummary() : undefined,
            buttons: isActivePlayer ? this.buttons : undefined,
            cardsInPlay: this.getSummaryForCardList(this.cardsInPlay, isActivePlayer),
            claim: this.getClaim(),
            deadPile: this.getSummaryForCardList(this.deadPile, isActivePlayer),
            discardPile: this.getSummaryForCardList(this.discardPile, isActivePlayer),
            faction: this.faction.getSummary(),
            firstPlayer: this.firstPlayer,
            gold: !isActivePlayer && this.phase === 'setup' ? 0 : this.gold,
            hand: this.getSummaryForCardList(this.hand, isActivePlayer, true),
            id: this.id,
            left: this.left,
            menuTitle: isActivePlayer ? this.menuTitle : undefined,
            numDrawCards: this.drawDeck.size(),
            name: this.name,
            numPlotCards: this.plotDeck.size(),
            phase: this.phase,
            plotDeck: this.getSummaryForCardList(this.plotDeck, isActivePlayer, true),
            plotDiscard: this.getSummaryForCardList(this.plotDiscard, isActivePlayer),
            plotSelected: !!this.selectedPlot,
            reserve: this.getTotalReserve(),
            selectCard: this.selectCard,
            totalPower: this.getTotalPower(),
            user: _.omit(this.user, 'password')
        };

        if(this.showDeck) {
            state.showDeck = true;
            state.drawDeck = this.getSummaryForCardList(this.drawDeck, isActivePlayer);
        }

        return state;
    }
}

module.exports = Player;
