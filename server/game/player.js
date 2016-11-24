const _ = require('underscore');

const Spectator = require('./spectator.js');
const cards = require('./cards');
const DrawCard = require('./drawcard.js');
const PlotCard = require('./plotcard.js');
const AgendaCard = require('./agendacard.js');

const StartingHandSize = 7;

class Player extends Spectator {
    constructor(id, name, owner, game) {
        super(id, name);

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

    findCardInPlayByCode(code) {
        return this.cardsInPlay.find(card => {
            return card.code === code;
        });
    }

    removeCardByUuid(list, uuid) {
        return _(list.reject(card => {
            return card.uuid === uuid;
        }));
    }

    findCardByName(list, name) {
        return list.find(card => {
            return card.name === name;
        });
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
        var returnedCard = undefined;

        if(!list) {
            return undefined;
        }

        list.each(card => {
            if(card.attachments) {
                var attachment = this.findCardByUuid(card.attachments, uuid);

                if(attachment) {
                    returnedCard = attachment;
                    return;
                }
            }

            if(card.card && card.uuid === uuid) {
                returnedCard = card;
                return;
            } else if(card.uuid === uuid) {
                returnedCard = card;
                return;
            }
        });

        return returnedCard;
    }

    findCardInPlayByUuid(uuid) {
        var returnedCard = undefined;

        this.cardsInPlay.each(card => {
            if(card.attachments) {
                var attachment = this.findCardByUuid(card.attachments, uuid);
                if(attachment) {
                    returnedCard = attachment;

                    return;
                }
            }

            if(card.uuid === uuid) {
                returnedCard = card;
                return;
            }
        });

        return returnedCard;
    }

    getDuplicateInPlay(card) {
        if(!card.isUnique()) {
            return undefined;
        }

        return this.cardsInPlay.find(playCard => {
            return playCard.code === card.code || playCard.name === card.name;
        });
    }

    getNumberOfChallengesWon(challengeType) {
        return this.challenges[challengeType].won;
    }

    getNumberOfChallengesInitiated() {
        return this.challenges.complete;
    }

    getCostForCard(card, spending) {
        var cost = card.getCost();

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

    initialise() {
        this.initDrawDeck();
        this.initPlotDeck();

        this.gold = 0;
        this.claim = 0;
        this.power = 0;
        this.reserve = 0;
        this.readyToStart = false;
        this.cardsInPlay = _([]);
        this.limitedPlayed = 0;
        this.maxLimited = 1;
        this.activePlot = undefined;
        this.plotDiscard = _([]);
        this.deadPile = _([]);
        this.discardPile = _([]);
        this.claimToDo = 0;

        this.menuTitle = 'Keep Starting Hand?';

        this.buttons = [
            { command: 'keep', text: 'Keep Hand' },
            { command: 'mulligan', text: 'Mulligan' }
        ];
    }

    startGame() {
        if(!this.readyToStart) {
            return;
        }

        this.gold = 8;
        this.phase = 'setup';

        this.buttons = [
            { command: 'setupdone', text: 'Done' }
        ];

        this.menuTitle = 'Select setup cards';
    }

    mulligan() {
        if(this.takenMulligan) {
            return false;
        }

        this.initDrawDeck();
        this.takenMulligan = true;

        this.buttons = [];
        this.menuTitle = 'Waiting for opponent to keep hand or mulligan';

        this.readyToStart = true;

        return true;
    }

    keep() {
        this.readyToStart = true;

        this.buttons = [];
        this.menuTitle = 'Waiting for opponent to keep hand or mulligan';
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

        if(this.phase !== 'setup' && this.phase !== 'marshal' && card.getType() !== 'event') {
            return false;
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

            this.removeFromHand(card.uuid);
            this.discardPile.push(card);

            return true;
        }

        if(this.phase === 'marshal') {
            this.game.addMessage('{0} marshals {1} costing {2}', this, card, cost);
        }

        if(card.getType() === 'attachment' && this.phase !== 'setup') {
            this.promptForAttachment(card);
            return true;
        }

        if(dupeCard && this.phase !== 'setup') {
            dupeCard.addDuplicate(card);
        } else {
            card.facedown = this.phase === 'setup';
            card.inPlay = true;
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
            }
        });

        this.cardsInPlay = processedCards;
    }

    marshalDone() {
        this.marshalled = true;
    }

    startPlotPhase() {
        this.phase = 'plot';

        this.menuTitle = 'Choose your plot';
        this.buttons = [
            { command: 'selectplot', text: 'Done' }
        ];
        this.gold = 0;
        this.claim = 0;
        this.reserve = 0;
        this.firstPlayer = false;
        this.selectedPlot = undefined;
        this.claimToDo = 0;
        this.doneChallenges = false;
        this.plotRevealed = false;
        this.roundDone = false;
        this.marshalled = false;
        this.challenges = {
            complete: 0,
            maxTotal: 3,
            military: {
                performed: 0,
                max: 1,
                won: 0
            },
            intrigue: {
                performed: 0,
                max: 1,
                won: 0
            },
            power: {
                performed: 0,
                max: 1,
                won: 0
            }
        };
        
        this.challengerLimit = 0;

        this.cardsInPlay.each(card => {
            card.new = false;
        });
    }

    selectPlot(plotId) {
        var plot = this.findCardByUuid(this.plotDeck, plotId);

        if(!plot) {
            return false;
        }

        plot.facedown = true;
        this.selectedPlot = plot;

        return true;
    }

    revealPlot() {
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
        this.revealFinished = false;

        this.selectedPlot = undefined;
    }

    drawPhase() {
        this.phase = 'draw';
        this.drawCardsToHand(2);
    }

    beginMarshal() {
        this.phase = 'marshal';

        this.buttons = [{ command: 'donemarshal', text: 'Done' }];
        this.menuTitle = 'Marshal your cards';

        this.gold += this.getTotalIncome();
        this.reserve = this.getTotalReserve();
        this.claim = this.activePlot.claim || 0;

        this.limitedPlayed = 0;
        this.marshalled = false;
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

    attach(attachment, cardId) {
        var card = this.findCardInPlayByUuid(cardId);

        if(!card || !attachment) {
            return;
        }

        attachment.parent = card;
        attachment.facedown = false;

        card.attachments.push(attachment);

        attachment.attach(this, card);
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
            return false;
        }

        switch(target) {
            case 'hand':
                this.hand.push(card);
                break;
            case 'discard pile':
                if(source === 'play area') {
                    this.discardCard(cardId, this.discardPile);

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

                if(card.getType() === 'attachment') {
                    this.dropPending = true;
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
        this.selectedAttachment = card.uuid;
        this.selectCard = true;
        this.oldMenuTitle = this.menuTitle;
        this.oldButtons = this.buttons;
        this.menuTitle = 'Select target for attachment';
        this.buttons = [
            { text: 'Done', command: 'doneattachment' }
        ];
    }

    beginChallenge() {
        this.phase = 'challenge';
        this.menuTitle = '';
        this.buttons = [
            { text: 'Military', command: 'challenge', arg: 'military' },
            { text: 'Intrigue', command: 'challenge', arg: 'intrigue' },
            { text: 'Power', command: 'challenge', arg: 'power' },
            { text: 'Done', command: 'doneallchallenges' }
        ];

        this.cardsInChallenge = _([]);
        this.cardsInPlay.each(card => {
            card.resetForChallenge();
        });
        this.selectCard = false;
        this.selectingChallengers = false;
        this.selectedAttachment = undefined;
    }

    startChallenge(challengeType) {
        this.menuTitle = 'Select challenge targets';
        this.buttons = [
            { text: 'Done', command: 'donechallenge' }
        ];

        this.currentChallenge = challengeType;
        this.selectCard = true;
        this.challenger = true;
        this.selectingChallengers = true;
        this.pickingStealth = false;
    }

    canAddToChallenge(cardId) {
        var card = this.findCardInPlayByUuid(cardId);

        if(this.challengerLimit && this.cardsInChallenge.size() >= this.challengerLimit) {
            return false;
        }

        if(!card) {
            return false;
        }

        if(!card.hasIcon(this.currentChallenge)) {
            return false;
        }

        if(card.stealth) {
            return false;
        }

        return card;
    }

    addToChallenge(card) {
        card.selected = !card.selected;

        if(card.selected) {
            this.cardsInChallenge.push(card);
        } else {
            this.cardsInChallenge = this.removeCardByUuid(this.cardsInChallenge, card.uuid);
        }
    }

    doneChallenge(myChallenge) {
        this.selectingChallengers = false;

        var challengeCards = this.cardsInPlay.filter(card => {
            return card.selected;
        });

        var strength = _.reduce(challengeCards, (memo, card) => {
            card.kneeled = true;
            card.selected = false;

            return memo + card.getStrength();
        }, 0);

        this.challengeStrength = strength;
        this.selectCard = false;

        if(myChallenge) {
            this.challenges[this.currentChallenge].performed++;
            this.challenges.complete++;
        }
    }

    beginDefend(challenge) {
        this.menuTitle = 'Select defenders';
        this.buttons = [
            { text: 'Done', command: 'donedefend' }
        ];

        this.selectCard = true;
        this.currentChallenge = challenge;
        this.phase = 'challenge';
        this.cardsInChallenge = _([]);
        this.selectingChallengers = true;
    }

    selectCharacterToKill() {
        this.selectCard = true;
        this.phase = 'claim';

        this.menuTitle = 'Select character to kill';
        this.buttons = [
            { command: 'cancelclaim', text: 'Done' }
        ];
    }

    killCharacter(card) {
        var character = this.findCardInPlayByUuid(card.uuid);

        if(!character) {
            return;
        }

        if(!character.dupes.isEmpty()) {
            var discardedDupe = character.dupes.first();

            character.dupes = _(character.dupes.slice(1));

            this.discardPile.push(discardedDupe);
        } else {
            this.discardCard(card.uuid, this.deadPile);
        }

        this.claimToDo--;
    }

    doneClaim() {
        this.phase = 'challenge';
        this.selectCard = false;

        this.menuTitle = 'Waiting for opponent to issue challenge';
        this.buttons = [];
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
            card.kneeled = false;
        });
    }

    taxation() {
        this.gold = 0;
    }

    getTotalPower() {
        var power = this.cardsInPlay.reduce((memo, card) => {
            return memo + card.getPower();
        }, this.power);

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
            this.removeAttachment(attachment);
        });

        this.cardsInPlay = this.removeCardByUuid(this.cardsInPlay, cardId);

        if(card.parent && card.parent.attachments) {
            card.parent.attachments = this.removeCardByUuid(card.parent.attachments, cardId);
        }

        pile.push(card);
        card.leavesPlay();
    }

    removeAttachment(attachment) {
        attachment.parent.attachments = this.removeCardByUuid(attachment.parent.attachments, attachment.uuid);

        attachment.leavesPlay();        
        if(attachment.isTerminal()) {
            attachment.parent = undefined;
            attachment.owner.discardPile.push(attachment);
        } else {
            attachment.owner.hand.push(attachment);
        }
    }

    selectDeck(deck) {
        this.drawCards = _([]);
        this.plotCards = _([]);

        _.each(deck.drawCards, cardEntry => {
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

        _.each(deck.plotCards, cardEntry => {
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

        this.deck = deck;

        if(deck.agenda) {
            if(cards[deck.agenda.code]) {
                this.agenda = new cards[deck.agenda.code](this, deck.agenda);
            } else {
                this.agenda = new AgendaCard(this, deck.agenda);
            }

            this.agenda.inPlay = true;
        } else {
            this.agenda = undefined;
        }

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

    getSummaryForCardList(list, isActivePlayer, hideWhenFaceup) {
        return list.map(card => {
            return card.getSummary(isActivePlayer, hideWhenFaceup);
        });
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
            power: this.power,
            totalPower: this.getTotalPower(),
            reserve: this.reserve,
            claim: this.claim,
            phase: this.phase,
            cardsInPlay: this.getSummaryForCardList(this.cardsInPlay, isActivePlayer),
            plotDeck: isActivePlayer ? this.getSummaryForCardList(this.plotDeck, isActivePlayer) : undefined,
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
