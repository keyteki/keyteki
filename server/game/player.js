const _ = require('underscore');

const Spectator = require('./spectator.js');
const cards = require('./cards');
const DrawCard = require('./drawcard.js');
const PlotCard = require('./plotcard.js');
const AgendaCard = require('./agendacard.js');
const AttachmentPrompt = require('./gamesteps/attachmentprompt.js');

const StartingHandSize = 7;

class Player extends Spectator {
    constructor(id, user, owner, game) {
        super(id, user);

        this.drawCards = _([]);
        this.plotCards = _([]);
        this.drawDeck = _([]);
        this.hand = _([]);
        this.faction = new DrawCard(this, {});

        this.owner = owner;
        this.takenMulligan = false;
        this.game = game;
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
        this.hand = _(this.hand.concat(this.drawDeck.first(numCards)));
        this.drawDeck = _(this.drawDeck.rest(numCards));
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

    moveFromDrawDeckToHand(card) {
        this.drawDeck = this.removeCardByUuid(this.drawDeck, card.uuid);

        this.hand.push(card);
    }

    shuffleDrawDeck() {
        this.drawDeck = _(this.drawDeck.shuffle());
    }

    removeFromHand(cardId) {
        this.hand = this.removeCardByUuid(this.hand, cardId);
    }

    discardFromDraw(number) {
        for(var i = 0; i < number; i++) {
            this.discardPile.push(this.drawDeck.first());
            this.drawDeck = _(this.drawDeck.slice(1));
        }
    }

    addCardToDrawDeck(card) {
        this.drawDeck.push(card);
    }

    discardAtRandom(number) {
        var toDiscard = number;

        while(toDiscard > 0) {
            var cardIndex = _.random(0, this.hand.size() - 1);

            var discarded = this.hand.value().splice(cardIndex, 1);

            _.each(discarded, card => {
                this.game.addMessage('{0} discards {1} at random', this, card);
                this.discardPile.push(card);
            });

            toDiscard--;
        }
    }

    addChallenge(type, number) {
        this.challenges[type].max += number;
        this.challenges.maxTotal += number;
    }

    setMaxChallenge(number) {
        this.challenges.maxTotal = number;
    }

    initDrawDeck() {
        this.drawDeck = this.drawCards;
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
        this.cardsInPlay = _([]);
        this.limitedPlayed = 0;
        this.maxLimited = 1;
        this.activePlot = undefined;
        this.plotDiscard = _([]);
        this.deadPile = _([]);
        this.discardPile = _([]);
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
        var canPlay = true;

        this.cardsInPlay.each(c => {
            canPlay = c.canPlay(this, card);

            if(!canPlay) {
                return;
            }
        });

        if(!canPlay) {
            return false;
        }

        canPlay = card.canPlay(this, card);
        if(!canPlay) {
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

    playCard(cardId, forcePlay, sourceList) {
        if(!sourceList) {
            sourceList = this.hand;
        }

        var card = this.findCardByUuid(sourceList, cardId);

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

            this.removeFromHand(card.uuid);
            this.discardPile.push(card);

            return true;
        }

        if(this.phase === 'marshal') {
            this.game.addMessage('{0} {1} {2} costing {3}', this, dupeCard ? 'duplicates' : 'marshals', card, cost);
        } else if(this.phase === 'challenge' && card.isAmbush()) {
            this.game.addMessage('{0} ambushes with {1} costing {2}', this, card, cost);
        }

        if(card.getType() === 'attachment' && this.phase !== 'setup' && !dupeCard) {
            this.promptForAttachment(card);
            // Hacky workaround for drag and drop.
            this.dropPending = sourceList === this.discardPile;
            return true;
        }

        if(dupeCard && this.phase !== 'setup') {
            dupeCard.addDuplicate(card);
        } else {
            if(this.phase !== 'setup') {
                this.game.raiseEvent('onCardEntersPlay', card);
            }

            card.facedown = this.phase === 'setup';
            card.play(this);
            card.new = true;
            this.cardsInPlay.push(card);
        } 

        if(card.isLimited() && !forcePlay) {
            this.limitedPlayed++;
        }

        if(sourceList === this.hand) {
            this.removeFromHand(card.uuid);
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
                this.game.raiseEvent('onCardEntersPlay', card);
            }

        });

        this.cardsInPlay = processedCards;
    }

    startPlotPhase() {
        this.gold = 0;
        this.claim = 0;
        this.reserve = 0;
        this.firstPlayer = false;
        this.selectedPlot = undefined;
        this.plotRevealed = false;
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

        this.cardsInPlay.each(card => {
            card.new = false;
        });
    }

    flipPlotFaceup() {
        this.menuTitle = '';
        this.buttons = [];

        this.selectedPlot.flipFaceup();
        
        if(this.activePlot) {
            this.activePlot.leavesPlay(this);
            this.plotDiscard.push(this.activePlot);
        }

        this.activePlot = this.selectedPlot;
        this.plotDeck = this.removeCardByUuid(this.plotDeck, this.selectedPlot.uuid);

        if(this.plotDeck.isEmpty()) {
            this.plotDeck = this.plotDiscard;
            this.plotDiscard = _([]);
        }

        this.plotRevealed = true;

        this.selectedPlot = undefined;
    }

    drawPhase() {
        this.drawCardsToHand(2);
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

        attachment.parent = card;
        attachment.facedown = false;

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
        var player = this;

        if(!card) {
            if(source === 'play area') {
                var otherPlayer = this.game.getOtherPlayer(this);

                if(!otherPlayer) {
                    return false;
                }

                card = otherPlayer.findCardInPlayByUuid(cardId);

                if(!card || card.controller !== this) {
                    return false;
                }

                player = otherPlayer;
            } else {
                return false;
            }
        }

        switch(target) {
            case 'hand':
                card.facedown = false;
                this.hand.push(card);
                break;
            case 'discard pile':
                if(source === 'play area') {
                    player.discardCard(cardId, this.discardPile);

                    return true;
                }

                this.discardPile.push(card);

                break;
            case 'dead pile':
                if(card.getType() !== 'character') {
                    return false;
                }

                if(source === 'play area') {
                    this.discardCard(cardId, this.deadPile);

                    return true;
                }

                this.deadPile.push(card);
                break;
            case 'play area':
                if(card.getType() === 'event') {
                    return false;
                }

                this.game.playCard(this.id, cardId, true, sourceList);

                if(this.dropPending) {
                    return true;
                }

                if(source === 'hand') {
                    return true;
                }
                break;
            case 'draw deck':
                this.drawDeck.unshift(card);
                break;
        }

        if(card.parent && card.parent.attachments) {
            card.parent.attachments = this.removeCardByUuid(card.parent.attachments, cardId);

            card.parent = undefined;
        }

        sourceList = this.removeCardByUuid(sourceList, cardId);

        this.updateSourceList(source, sourceList);

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

    killCharacter(card, allowSave = true) {
        var character = this.findCardInPlayByUuid(card.uuid);

        if(!character) {
            return;
        }

        if(!character.dupes.isEmpty() && allowSave) {
            var discardedDupe = character.dupes.first();

            character.dupes = _(character.dupes.slice(1));

            this.game.raiseEvent('onDupeDiscarded', this, character, discardedDupe);

            this.discardPile.push(discardedDupe);
        } else {
            this.discardCard(card.uuid, this.deadPile);

            this.game.raiseEvent('onCharacterKilled', this, character);
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

    discardCard(cardId, pile) {
        var card = this.findCardInPlayByUuid(cardId);

        if(!card) {
            return;
        }

        card.dupes.each(dupe => {
            pile.push(dupe);
        });

        card.dupes = _([]);

        card.attachments.each(attachment => {
            this.removeAttachment(attachment, false);
        });

        this.cardsInPlay = this.removeCardByUuid(this.cardsInPlay, cardId);

        if(card.parent && card.parent.attachments) {
            card.parent.attachments = this.removeCardByUuid(card.parent.attachments, cardId);
        }

        pile.push(card);
        card.leavesPlay();

        this.game.raiseEvent('onCardLeftPlay', this, card);
    }

    removeAttachment(attachment, allowSave = true) {
        while(attachment.dupes.size() > 0) {
            var dupe = attachment.removeDuplicate();
            dupe.owner.discardPile.push(dupe);
            if(allowSave) {
                return;
            }
        }

        attachment.parent.attachments = this.removeCardByUuid(attachment.parent.attachments, attachment.uuid);
        attachment.leavesPlay();
        attachment.parent = undefined;

        if(attachment.isTerminal()) {
            attachment.owner.discardPile.push(attachment);
        } else {
            attachment.owner.hand.push(attachment);
        }
    }

    selectDeck(deck) {
        this.deck = deck;

        this.faction.cardData = deck.faction;
        this.faction.cardData.code = deck.faction.value;
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
            discardPile: this.getSummaryForCardList(this.discardPile, isActivePlayer)
        };

        if(this.showDeck) {
            state.showDeck = true;
            state.drawDeck = this.getSummaryForCardList(this.drawDeck, isActivePlayer);
        }

        return state;
    }
}

module.exports = Player;
