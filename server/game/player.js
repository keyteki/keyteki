const _ = require('underscore');

const Spectator = require('./spectator.js');
const cards = require('./cards');
const DrawCard = require('./drawcard.js');
const PlotCard = require('./plotcard.js');
const AgendaCard = require('./agendacard.js');
const AttachmentPrompt = require('./gamesteps/attachmentprompt.js');

const StartingHandSize = 7;
const DrawPhaseCards = 2;

class Player extends Spectator {
    constructor(id, user, owner, game) {
        super(id, user);

        this.drawCards = _([]);
        this.plotCards = _([]);
        this.drawDeck = _([]);
        this.plotDeck = _([]);
        this.plotDiscard = _([]);
        this.hand = _([]);
        this.cardsInPlay = _([]);
        this.deadPile = _([]);
        this.discardPile = _([]);

        this.faction = new DrawCard(this, {});

        this.owner = owner;
        this.takenMulligan = false;
        this.game = game;

        this.deck = {};
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
        if(uuid === this.agenda.uuid) {
            return this.agenda;
        }

        var card = this.findCardByUuid(this.cardsInPlay, uuid);

        if(card) {
            return card;
        }

        card = this.findCardByUuid(this.hand, uuid);

        if(card) {
            return card;
        }

        card = this.findCardByUuid(this.discardPile, uuid);
        if(card) {
            return card;
        }

        card = this.findCardByUuid(this.deadPile, uuid);
        if(card) {
            return card;
        }

        card = this.findCardByUuid(this.plotDeck, uuid);
        if(card) {
            return card;
        }

        card = this.findCardByUuid(this.plotDiscard, uuid);
        if(card) {
            return card;
        }
    }

    findCardByUuid(list, uuid) {
        return this.findCard(list, card => card.uuid === uuid);
    }

    findCardInPlayByUuid(uuid) {
        return this.findCard(this.cardsInPlay, card => card.uuid === uuid);
    }

    findCard(cards, predicate) {
        if(!cards) {
            return;
        }

        return cards.reduce((matchingCard, card) => {
            if(matchingCard) {
                return matchingCard;
            }

            if(predicate(card)) {
                return card;
            }

            if(card.attachments) {
                return card.attachments.find(predicate);
            }
        }, undefined);
    }

    getDuplicateInPlay(card) {
        if(!card.isUnique()) {
            return undefined;
        }

        return this.findCard(this.cardsInPlay, playCard => {
            return playCard.code === card.code || playCard.name === card.name;
        });
    }

    getNumberOfChallengesWon(challengeType) {
        return this.challenges[challengeType].won;
    }

    getNumberOfChallengesLost(challengeType) {
        return this.challenges[challengeType].lost;
    }

    getNumberOfChallengesInitiated() {
        return this.challenges.complete;
    }

    getCostForCard(card, spending) {
        var cost;
        if(this.phase === 'challenge' && card.isAmbush()) {
            cost = card.getAmbushCost();
        } else {
            cost = card.getCost();
        }

        if(this.activePlot && this.activePlot.canReduce(this, card)) {
            cost = this.activePlot.reduce(card, cost, spending);
        }

        if(this.agenda && this.agenda.canReduce(this, card)) {
            cost = this.agenda.reduce(card, cost, spending);
        }

        this.cardsInPlay.each(c => {
            if(c.canReduce(this, card)) {
                cost = c.reduce(card, cost, spending);
            }
        });

        return cost;
    }

    modifyClaim(winner, challengeType, claim) {
        claim = this.activePlot.modifyClaim(winner, challengeType, claim);
        this.cardsInPlay.each(card => {
            claim = card.modifyClaim(winner, challengeType, claim);
        });

        return claim;
    }

    drawCardsToHand(numCards) {
        var cards = this.drawDeck.first(numCards);
        _.each(cards, card => {
            this.moveCard(card, 'hand');
        });
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

    discardFromDraw(number) {
        for(var i = 0; i < number; i++) {
            this.discardCard(this.drawDeck.first());
        }
    }

    moveFromTopToBottomOfDrawDeck(number) {
        while(number > 0) {
            var nextCard = this.drawDeck.value().shift();
            this.drawDeck.push(nextCard);

            number--;
        }
    }

    discardAtRandom(number) {
        var toDiscard = number;

        if(toDiscard > this.hand.size()) {
            toDiscard = this.hand.size();
        }

        while(toDiscard > 0) {
            var cardIndex = _.random(0, this.hand.size() - 1);

            var card = this.hand.value()[cardIndex];

            this.game.addMessage('{0} discards {1} at random', this, card);
            this.discardCard(card);

            toDiscard--;
        }
    }

    discardFromHand(cardId) {
        var retCard = this.hand.find(card => {
            return card.uuid === cardId;
        });

        if(retCard === -1) {
            return undefined;
        }

        this.discardCard(retCard);        

        return retCard;
    }

    addChallenge(type, number) {
        this.challenges[type].max += number;
        this.challenges.maxTotal += number;
    }

    setMaxChallenge(number) {
        this.challenges.maxTotal = number;
    }

    initDrawDeck() {
        this.allCards = _(this.drawCards.clone());
        this.drawDeck = this.drawCards;
        this.drawDeck.each(card => card.location = 'draw deck');
        this.shuffleDrawDeck();
        this.hand = _([]);
        this.drawCardsToHand(StartingHandSize);
    }

    initPlotDeck() {
        this.plotDeck = this.plotCards;
    }

    prepareDecks() {
        this.drawCards = _([]);
        this.plotCards = _([]);

        _.each(this.deck.drawCards, cardEntry => {
            for(var i = 0; i < cardEntry.count; i++) {
                var drawCard = undefined;

                if(cards[cardEntry.card.code]) {
                    drawCard = new cards[cardEntry.card.code](this, cardEntry.card);
                } else {
                    drawCard = new DrawCard(this, cardEntry.card);
                }

                drawCard.location = 'draw deck';

                this.drawCards.push(drawCard);
            }
        });

        _.each(this.deck.plotCards, cardEntry => {
            for(var i = 0; i < cardEntry.count; i++) {
                var plotCard = undefined;

                if(cards[cardEntry.card.code]) {
                    plotCard = new cards[cardEntry.card.code](this, cardEntry.card);
                } else {
                    plotCard = new PlotCard(this, cardEntry.card);
                }

                plotCard.location = 'plot deck';

                this.plotCards.push(plotCard);
            }
        });

        if(this.deck.agenda) {
            if(cards[this.deck.agenda.code]) {
                this.agenda = new cards[this.deck.agenda.code](this, this.deck.agenda);
            } else {
                this.agenda = new AgendaCard(this, this.deck.agenda);
            }

            this.agenda.inPlay = true;
            this.agenda.location = 'agenda';
        } else {
            this.agenda = undefined;
        }
    }

    initialise() {
        this.prepareDecks();
        this.initDrawDeck();
        this.initPlotDeck();

        this.gold = 0;
        this.claim = 0;
        this.reserve = 0;
        this.readyToStart = false;
        this.cardsInChallenge = _([]);
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

    canPlayCard(card) {
        if(this.activePlot && !this.activePlot.canPlay(this, card)) {
            return false;
        }

        if(!this.cardsInPlay.all(c => c.canPlay(this, card))) {
            return false;
        }

        if(!card.canPlay(this, card)) {
            return false;
        }

        if(this.phase !== 'setup' && this.phase !== 'marshal' && card.getType() !== 'event') {
            if(this.phase !== 'challenge' || !card.isAmbush()) {
                return false;
            }
        }

        if(!this.isCardUuidInList(this.hand, card)) {
            return false;
        }

        var dupe = this.getDuplicateInPlay(card);

        if(this.getCostForCard(card, false) > this.gold && !dupe) {
            return false;
        }

        if(this.limitedPlayed >= this.maxLimited && card.isLimited() && !dupe) {
            return false;
        }

        if(card.getType() === 'character' && card.isUnique()) {
            if(this.isCardNameInList(this.deadPile, card)) {
                return false;
            }
        }

        return true;
    }

    playCard(card, forcePlay) {
        if(!card) {
            return false;
        }

        if(!forcePlay && !this.canPlayCard(card)) {
            return false;
        }

        var dupeCard = this.getDuplicateInPlay(card);
        var cost = 0;

        if(!dupeCard && !forcePlay) {
            cost = this.getCostForCard(card, true);
        }

        this.gold -= cost;

        if(card.getType() === 'event') {
            this.game.addMessage('{0} plays {1} costing {2}', this, card, cost);

            card.play(this);

            this.moveCard(card, 'discard pile');

            return true;
        }

        if(this.phase === 'marshal') {
            this.game.addMessage('{0} {1} {2} costing {3}', this, dupeCard ? 'duplicates' : 'marshals', card, cost);
        } else if(this.phase === 'challenge' && card.isAmbush()) {
            this.game.addMessage('{0} ambushes with {1} costing {2}', this, card, cost);
        }

        if(card.getType() === 'attachment' && this.phase !== 'setup' && !dupeCard) {
            this.promptForAttachment(card);
            return true;
        }

        if(dupeCard && this.phase !== 'setup') {
            this.removeCardFromPile(card);
            dupeCard.addDuplicate(card);
        } else {
            if(this.phase !== 'setup') {
                this.game.raiseEvent('onCardEntersPlay', card);
            }

            card.facedown = this.phase === 'setup';
            if(!dupeCard) {
                card.play(this);
            }
            card.new = true;
            this.moveCard(card, 'play area');
        }

        if(card.isLimited() && !forcePlay) {
            this.limitedPlayed++;
        }

        return true;
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
        this.claim = 0;
        this.reserve = 0;
        this.firstPlayer = false;
        this.selectedPlot = undefined;
        this.roundDone = false;
        this.challenges = {
            complete: 0,
            maxTotal: 3,
            military: {
                performed: 0,
                max: 1,
                won: 0,
                lost: 0
            },
            intrigue: {
                performed: 0,
                max: 1,
                won: 0,
                lost: 0
            },
            power: {
                performed: 0,
                max: 1,
                won: 0,
                lost: 0
            }
        };

        this.challengerLimit = 0;
        this.drawPhaseCards = DrawPhaseCards;

        this.cardsInPlay.each(card => {
            card.new = false;
        });
    }

    flipPlotFaceup() {
        this.selectedPlot.flipFaceup();

        if(this.activePlot) {
            var previousPlot = this.removeActivePlot();
            this.plotDiscard.push(previousPlot);
        }

        this.activePlot = this.selectedPlot;
        this.plotDeck = this.removeCardByUuid(this.plotDeck, this.selectedPlot.uuid);

        if(this.plotDeck.isEmpty()) {
            this.plotDeck = this.plotDiscard;
            this.plotDiscard = _([]);
        }

        this.selectedPlot = undefined;
    }

    removeActivePlot() {
        if(this.activePlot) {
            var plot = this.activePlot;
            plot.leavesPlay(this);
            this.activePlot = undefined;
            return plot;
        }
    }

    revealPlot() {
        this.activePlot.onReveal(this);
        this.reserve = this.getTotalReserve();
        this.claim = this.activePlot.claim || 0;
    }

    drawPhase() {
        this.game.addMessage('{0} draws {1} cards for the draw phase', this, this.drawPhaseCards);
        this.drawCardsToHand(this.drawPhaseCards);
    }

    beginMarshal() {
        this.gold += this.getTotalIncome();
        this.reserve = this.getTotalReserve();
        this.claim = this.activePlot.claim || 0;

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

        return attachment.canAttach(this, card);
    }

    attach(player, attachment, cardId) {
        var card = this.findCardInPlayByUuid(cardId);

        if(!card || !attachment) {
            return;
        }

        attachment.owner.removeCardFromPile(attachment);

        attachment.parent = card;
        attachment.facedown = false;
        attachment.location = 'play area';
        attachment.inPlay = true;

        card.attachments.push(attachment);

        attachment.attach(player, card);
    }

    showDrawDeck() {
        this.showDeck = true;
    }

    isValidDropCombination(source, target) {
        if(source === 'plot' && target !== 'plot discard pile') {
            return false;
        }

        if(source === 'plot discard pile' && target !== 'plot') {
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
        }
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
            this.game.playCard(this.name, cardId, true, sourceList);
        } else {
            this.moveCard(card, target);
        }

        return true;
    }

    promptForAttachment(card) {
        // TODO: Really want to move this out of here.
        this.game.queueStep(new AttachmentPrompt(this.game, this, card));
    }

    beginChallenge() {
        this.cardsInChallenge = _([]);
        this.cardsInPlay.each(card => {
            card.resetForChallenge();
        });
        this.selectCard = false;
    }

    canAddToChallenge(card, challengeType) {
        if(this.challengerLimit && this.cardsInChallenge.size() >= this.challengerLimit) {
            return false;
        }

        if(!card) {
            return false;
        }

        if(!card.inPlay) {
            return false;
        }

        if(!card.hasIcon(challengeType)) {
            return false;
        }

        if(card.stealth) {
            return false;
        }

        if(card.kneeled) {
            return false;
        }

        return card;
    }

    initiateChallenge(challengeType) {
        this.challenges[challengeType].performed++;
        this.challenges.complete++;
    }

    winChallenge(challengeType) {
        this.challenges[challengeType].won++;
    }

    loseChallenge(challengeType) {
        this.challenges[challengeType].lost++;
    }

    resetForChallenge() {
        this.cardsInPlay.each(card => {
            card.resetForChallenge();
        });
    }

    sacrificeCard(card) {
        this.moveCard(card, 'discard pile');
        this.game.raiseEvent('onSacrificed', this, card);
    }

    discardCard(card, allowSave = true) {
        if(!card.dupes.isEmpty() && allowSave) {
            if(!this.removeDuplicate(card)) {
                this.moveCard(card, 'discard pile');    
            }
        } else {
            this.moveCard(card, 'discard pile');
        }
    }

    killCharacter(card, allowSave = true) {
        var character = this.findCardInPlayByUuid(card.uuid);

        if(!character) {
            return;
        }

        if(!character.dupes.isEmpty() && allowSave) {
            if(!this.removeDuplicate(character)) {
                this.moveCard(card, 'dead pile');
            }
        } else {
            var event = this.game.raiseEvent('onCharacterKilled', this, character, allowSave);
            if(!event.cancel || !allowSave) {
                this.moveCard(card, 'dead pile');
            }
        }
    }

    getDominance() {
        var cardStrength = this.cardsInPlay.reduce((memo, card) => {
            if(!card.kneeled && card.getType() === 'character') {
                return memo + card.getStrength();
            }

            return memo;
        }, 0);

        this.cardsInPlay.each(card => {
            cardStrength = card.modifyDominance(this, cardStrength);
        });

        return cardStrength + this.gold;
    }

    standCards() {
        this.cardsInPlay.each(card => {
            card.attachments.each(attachment => {
                attachment.kneeled = false;
            });

            card.kneeled = false;
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
    }

    moveCard(card, targetLocation) {
        var targetPile = this.getSourceList(targetLocation);

        if(!targetPile) {
            return;
        }

        this.removeCardFromPile(card);

        if(card.location === 'play area') {
            if(card.owner !== this) {
                card.owner.moveCard(card, targetLocation);
                return;
            }

            card.attachments.each(attachment => {
                this.removeAttachment(attachment, false);
            });

            while(card.dupes.size() > 0) {
                this.removeDuplicate(card);
            }

            card.leavesPlay();
            this.game.raiseEvent('onCardLeftPlay', this, card);

            if(card.parent && card.parent.attachments) {
                card.parent.attachments = this.removeCardByUuid(card.parent.attachments, card.uuid);
                card.parent = undefined;
            }
        }

        card.location = targetLocation;
        if(targetLocation === 'draw deck') {
            targetPile.unshift(card);
        } else {
            targetPile.push(card);
        }

        if(targetLocation !== 'play area') {
            card.facedown = false;
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
        
        dupe.facedown = false;
        dupe.location = 'discard pile';
        dupe.owner.discardPile.push(dupe);
        this.game.raiseEvent('onDupeDiscarded', this, card, dupe);

        return true;
    }

    removeCardFromPile(card) {
        var originalLocation = card.location;
        var originalPile = this.getSourceList(originalLocation);
        if(originalPile) {
            originalPile = this.removeCardByUuid(originalPile, card.uuid);
            this.updateSourceList(originalLocation, originalPile);
        }
    }

    getTotalPlotStat(property) {
        var baseValue = 0;

        if(this.activePlot && property(this.activePlot)) {
            baseValue = property(this.activePlot);
        }

        var modifier = this.cardsInPlay.reduce((memo, card) => {
            return memo + (property(card) || 0);
        }, 0);

        return baseValue + modifier;
    }

    getTotalInitiative() {
        return this.getTotalPlotStat(card => {
            return card.getInitiative();
        });
    }

    getTotalIncome() {
        var gold = this.getTotalPlotStat(card => {
            return card.getIncome();
        });

        gold = this.activePlot.modifyIncome(this, gold);

        // XXX this player shouldn't know about the other player, this should be deffered to game
        var otherPlayer = this.game.getOtherPlayer(this);
        if(otherPlayer) {
            gold = otherPlayer.activePlot.modifyIncome(this, gold);
        }

        return gold;
    }

    getTotalReserve() {
        return this.getTotalPlotStat(card => {
            return card.getReserve();
        });
    }

    isBelowReserve() {
        return this.hand.size() <= this.reserve;
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
            agenda: this.agenda ? this.agenda.getSummary() : undefined,
            id: this.id,
            faction: this.faction.getSummary(),
            numDrawCards: this.drawDeck.size(),
            hand: this.getSummaryForCardList(this.hand, isActivePlayer, true),
            buttons: isActivePlayer ? this.buttons : undefined,
            menuTitle: isActivePlayer ? this.menuTitle : undefined,
            gold: !isActivePlayer && this.phase === 'setup' ? 0 : this.gold,
            totalPower: this.getTotalPower(),
            reserve: this.reserve,
            claim: this.claim,
            phase: this.phase,
            cardsInPlay: this.getSummaryForCardList(this.cardsInPlay, isActivePlayer),
            plotDeck: this.getSummaryForCardList(this.plotDeck, isActivePlayer, true),
            numPlotCards: this.plotDeck.size(),
            plotSelected: !!this.selectedPlot,
            activePlot: this.activePlot ? this.activePlot.getSummary(isActivePlayer) : undefined,
            firstPlayer: this.firstPlayer,
            plotDiscard: this.getSummaryForCardList(this.plotDiscard, isActivePlayer),
            selectCard: this.selectCard,
            deadPile: this.getSummaryForCardList(this.deadPile, isActivePlayer),
            discardPile: this.getSummaryForCardList(this.discardPile, isActivePlayer),
            user: _.omit(this.user, 'password'),
            name: this.name
        };

        if(this.showDeck) {
            state.showDeck = true;
            state.drawDeck = this.getSummaryForCardList(this.drawDeck, isActivePlayer);
        }

        return state;
    }
}

module.exports = Player;
