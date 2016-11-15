const _ = require('underscore');
const uuid = require('node-uuid');

const Spectator = require('./spectator.js');

class Player extends Spectator {
    constructor(id, name, owner, game) {
        super(id, name);

        this.drawCards = [];
        this.plotCards = [];
        this.drawDeck = [];
        this.hand = [];

        this.owner = owner;
        this.takenMulligan = false;
        this.game = game;
    }

    drawCardsToHand(numCards) {
        this.hand = this.hand.concat(_.first(this.drawDeck, numCards));
        this.drawDeck = _.rest(this.drawDeck, numCards);
    }

    searchDrawDeck(limit, predicate) {
        var cards = this.drawDeck;

        if(_.isFunction(limit)) {
            predicate = limit;
        } else {
            if(limit > 0) {
                cards = _.first(this.drawDeck, limit);
            } else {
                cards = _.last(this.drawDeck, -limit);
            }
        }

        return _.filter(cards, predicate);
    }

    moveFromDrawDeckToHand(card) {
        this.drawDeck = _.reject(this.drawDeck, c => {
            return c.uuid === card.uuid;
        });
        this.hand.push(card);
    }

    findDrawDeckCardByUuid(uuid) {
        return _.find(this.drawDeck, c => {
            return c.uuid === uuid;
        });
    }

    shuffleDrawDeck() {
        this.drawDeck = _.shuffle(this.drawDeck);
    }

    initDrawDeck() {
        this.drawDeck = this.drawCards;
        this.shuffleDrawDeck();
        this.hand = [];
        this.drawCardsToHand(7);
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
        this.cardsInPlay = [];
        this.limitedPlayed = false;
        this.activePlot = undefined;
        this.plotDiscard = [];
        this.deadPile = [];
        this.discardPile = [];
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
        if(this.phase !== 'setup' && this.phase !== 'marshal') {
            return false;
        }

        if(!_.any(this.hand, handCard => {
            return handCard.uuid === card.uuid;
        })) {
            return false;
        }

        var isDupe = this.isDuplicateInPlay(card);

        if(card.cost > this.gold && !isDupe) {
            return false;
        }

        if(this.limitedPlayed && this.hasKeyword(card, 'Limited') && !isDupe) {
            return false;
        }

        if(card.type_code === 'event') {
            return false;
        }

        if(card.type_code === 'character' && card.is_unique) {
            if(_.any(this.deadPile, c => {
                return c.code === card.code;
            })) {
                return false;
            }
        }

        return true;
    }

    isDuplicateInPlay(card) {
        if(!card.is_unique) {
            return false;
        }

        return _.any(this.cardsInPlay, playCard => {
            return playCard.card.code === card.code;
        });
    }

    removeFromHand(card) {
        var removed = false;

        this.hand = _.reject(this.hand, handCard => {
            if(handCard.uuid === card.uuid && !removed) {
                removed = true;

                return true;
            }

            return false;
        });
    }

    discardFromDraw(number) {
        for(var i = 0; i < number; i++) {
            this.discardPile.push(_.first(this.drawDeck));
            this.drawDeck = this.drawDeck.slice(1);
        }
    }

    playCard(card, dragDrop) {
        if(!dragDrop && !this.canPlayCard(card)) {
            return false;
        }

        var isDupe = this.isDuplicateInPlay(card);

        if(!isDupe && !dragDrop) {
            this.gold -= card.cost;
        }

        if(card.type_code === 'attachment' && this.phase !== 'setup') {
            this.promptForAttachment(card);
            return true;
        }

        if(isDupe && this.phase !== 'setup') {
            var dupe = _.find(this.cardsInPlay, c => {
                return c.card.code === card.code && c.card.uuid !== card.uuid;
            });

            dupe.dupes.push(card);
        } else {
            this.cardsInPlay.push({
                facedown: this.phase === 'setup', card: card, attachments: [], dupes: [], power: 0
            });
        }

        if(this.hasKeyword(card, 'Limited') && !dragDrop) {
            this.limitedPlayed = true;
        }

        if(!dragDrop) {
            this.removeFromHand(card);
        }

        return true;
    }

    setupDone() {
        this.setup = true;
    }

    postSetup() {
        this.drawCardsToHand(7 - this.hand.length);

        var processedCards = [];

        _.each(this.cardsInPlay, card => {
            card.facedown = false;

            var dupe = _.find(processedCards, c => {
                return c.card.is_unique && c.card.code === card.card.code;
            });

            if(dupe) {
                dupe.dupes.push(card.card);
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
    }

    selectPlot(plot) {
        if(!_.any(this.plotDeck, card => {
            return card.uuid === plot.uuid;
        })) {
            return false;
        }

        this.selectedPlot = { facedown: true, card: plot };

        return true;
    }

    revealPlot() {
        this.menuTitle = '';
        this.buttons = [];

        this.selectedPlot.facedown = false;
        if(this.activePlot) {
            this.plotDiscard.push(this.activePlot.card);
        }

        this.activePlot = this.selectedPlot;
        this.plotDeck = _.reject(this.plotDeck, card => {
            return card.uuid === this.selectedPlot.card.uuid;
        });

        if(this.plotDeck.length === 0) {
            this.plotDeck = this.plotDiscard;
            this.plotDiscard = [];
        }

        this.plotRevealed = true;
        this.revealFinished = false;

        this.selectedPlot = undefined;
    }

    hasWhenRevealed() {
        var plotText = this.activePlot.card.text;

        if(!_.isNull(plotText) && !_.isUndefined(plotText)) {
            return this.activePlot.card.text.indexOf('When Revealed:') !== -1;
        }

        return false;
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
        this.claim = this.activePlot.card.claim || 0;

        this.limitedPlayed = false;
        this.marshalled = false;
    }

    hasUnmappedAttachments() {
        return _.any(this.cardsInPlay, card => {
            return card.card.type_code === 'attachment';
        });
    }

    attach(attachment, card) {
        var inPlayCard = this.findCardInPlayByUuid(card.uuid);

        attachment.parent = inPlayCard;

        inPlayCard.attachments.push(attachment);
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

    drop(card, source, target) {
        if(!this.isValidDropCombination(source, target)) {
            return false;
        }

        var sourceList = this.getSourceList(source);

        var sourceCard = this.findCardByUuid(sourceList, card.uuid);
        if(!sourceCard) {
            return false;
        }

        switch(target) {
            case 'hand':
                this.hand.push(card);
                break;
            case 'discard pile':
                if(source === 'play area') {
                    this.discardCard(card, this.discardPile);

                    return true;
                }

                this.discardPile.push(card);

                break;
            case 'dead pile':
                if(card.type_code !== 'character') {
                    return false;
                }

                if(source === 'play area') {
                    this.discardCard(card, this.deadPile);

                    return true;
                }

                this.deadPile.push(card);
                break;
            case 'play area':
                if(card.type_code === 'event') {
                    return false;
                }

                this.game.playCard(this.id, card, true);

                if(card.type_code === 'attachment') {
                    this.dropPending = true;
                    return true;
                }
                break;
            case 'draw deck':
                this.drawDeck.unshift(sourceCard);
                break;
        }

        if(sourceCard.parent && sourceCard.parent.attachments) {
            sourceCard.parent.attachments = _.reject(sourceCard.parent.attachments, a => {
                return a.uuid === card.uuid;
            });
        }

        sourceList = _.reject(sourceList, c => {
            if(c.card) {
                return c.card.uuid === card.uuid;
            }

            return c.uuid === card.uuid;
        });

        this.updateSourceList(source, sourceList);

        return true;
    }

    promptForAttachment(card) {
        this.selectedAttachment = card;
        this.selectCard = true;
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

        this.cardsInChallenge = [];
        _.each(this.cardsInPlay, card => {
            card.stealth = undefined;
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

    addToStealth(card) {
        if(this.currentChallenge === 'military' && !card.is_military) {
            return false;
        }

        if(this.currentChallenge === 'intrigue' && !card.is_intrigue) {
            return false;
        }

        if(this.currentChallenge === 'power' && !card.is_power) {
            return false;
        }

        var inPlay = this.findCardInPlayByUuid(card.uuid);

        if(!inPlay) {
            return false;
        }

        inPlay.stealth = true;

        return true;
    }

    canAddToChallenge(card) {
        if(this.currentChallenge === 'military' && !card.is_military) {
            return false;
        }

        if(this.currentChallenge === 'intrigue' && !card.is_intrigue) {
            return false;
        }

        if(this.currentChallenge === 'power' && !card.is_power) {
            return false;
        }

        var inPlay = this.findCardInPlayByUuid(card.uuid);

        if(!inPlay) {
            return false;
        }

        if(inPlay.stealth) {
            return false;
        }

        return inPlay;
    }

    addToChallenge(card) {
        card.selected = !card.selected;

        if(card.selected) {
            this.cardsInChallenge.push(card);
        } else {
            this.cardsInChallenge = _.reject(this.cardsInChallenge, c => {
                return c.card.uuid === card.card.uuid;
            });
        }
    }

    doneChallenge(myChallenge) {
        this.selectingChallengers = false;

        var challengeCards = _.filter(this.cardsInPlay, card => {
            return card.selected;
        });

        var strength = _.reduce(challengeCards, (memo, card) => {
            card.kneeled = true;
            card.selected = false;

            return memo + card.card.strength;
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
        this.cardsInChallenge = [];
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
            return undefined;
        }

        if(character.dupes.length > 0) {
            var discardedDupe = _.first(character.dupes);

            character.dupes = character.dupes.slice(1);
            character = undefined;

            this.discardPile.push(discardedDupe);
        } else {
            this.cardsInPlay = _.reject(this.cardsInPlay, c => {
                return c.card.uuid === card.uuid;
            });

            this.deadPile.push(card);
        }

        this.claimToDo--;

        return character;
    }

    doneClaim() {
        this.phase = 'challenge';
        this.selectCard = false;

        this.menuTitle = 'Waiting for opponent to issue challenge';
        this.buttons = [];
    }

    discardAtRandom(number) {
        var toDiscard = number;

        while(toDiscard > 0) {
            var cardIndex = _.random(0, this.hand.length - 1);

            var discarded = this.hand.splice(cardIndex, 1);

            _.each(discarded, card => {
                this.discardPile.push(card);
            });

            toDiscard--;
        }
    }

    getDominance() {
        var cardStrength = _.reduce(this.cardsInPlay, (memo, card) => {
            if(!card.kneeled && card.card.type_code === 'character') {
                return memo + card.card.strength;
            }

            return memo;
        }, 0);

        return cardStrength + this.gold;
    }

    standCards() {
        _.each(this.cardsInPlay, card => {
            card.kneeled = false;
        });
    }

    taxation() {
        this.gold = 0;
    }

    getTotalPower() {
        var power = _.reduce(this.cardsInPlay, (memo, card) => {
            return memo + card.power;
        }, this.power);

        return power;
    }

    hasKeyword(card, keyword) {
        if(!card.text) {
            return false;
        }

        return card.text.indexOf(keyword + '.') !== -1;
    }

    discardCard(card, pile) {
        var cardInPlay = this.findCardInPlayByUuid(card.uuid);

        if(!cardInPlay) {
            return;
        }

        _.each(cardInPlay.dupes, dupe => {
            pile.push(dupe);
        });

        cardInPlay.dupes = [];

        _.each(cardInPlay.attachments, attachment => {
            this.removeAttachment(cardInPlay, attachment);
        });

        this.cardsInPlay = _.reject(this.cardsInPlay, c => {
            return c.card.uuid === card.uuid;
        });

        if(cardInPlay.parent && cardInPlay.parent.attachments) {
            cardInPlay.parent.attachments = _.reject(cardInPlay.parent.attachments, attachment => {
                return attachment.uuid === cardInPlay.uuid;
            });

            this.game.notifyLeavingPlay(this, cardInPlay);
        }

        pile.push(card);
    }

    removeAttachment(cardInPlay, attachment) {
        var otherPlayer = this.game.getOtherPlayer(this);
        var owner = attachment.owner === this.id ? this : otherPlayer;

        if(this.hasKeyword(attachment, 'Terminal')) {
            owner.discardPile.push(attachment);
        } else {
            owner.hand.push(attachment);
        }

        this.game.notifyLeavingPlay(this, attachment);
    }

    findCardInPlayByUuid(uuid) {
        var returnedCard = undefined;

        _.each(this.cardsInPlay, card => {
            var attachment = this.findCardByUuid(card.attachments, uuid);
            if(attachment) {
                returnedCard = attachment;

                return;
            }

            if(card.card.uuid === uuid) {
                returnedCard = card;
                return;
            }
        });

        return returnedCard;
    }

    findCardInPlayByCode(code) {
        return _.find(this.cardsInPlay, card => {
            return card.card.code === code;
        });
    }

    findCardByUuid(list, uuid) {
        var returnedCard = undefined;

        _.each(list, card => {
            if(card.attachments) {
                var attachment = this.findCardByUuid(card.attachments, uuid);

                if(attachment) {
                    returnedCard = attachment;
                    return;
                }
            }

            if(card.card && card.card.uuid === uuid) {
                returnedCard = card;
                return;
            } else if(card.uuid === uuid) {
                returnedCard = card;
                return;
            }
        });

        return returnedCard;
    }

    selectDeck(deck) {
        this.drawCards = [];
        this.plotCards = [];

        _.each(deck.drawCards, card => {
            for(var i = 0; i < card.count; i++) {
                var drawCard = _.clone(card.card);
                drawCard.uuid = uuid.v1();
                drawCard.owner = this.id;
                this.drawCards.push(drawCard);
            }
        });

        _.each(deck.plotCards, card => {
            for(var i = 0; i < card.count; i++) {
                var plotCard = _.clone(card.card);
                plotCard.uuid = uuid.v1();
                plotCard.owner = this.id;
                this.plotCards.push(plotCard);
            }
        });

        this.deck = deck;
    }

    getTotalPlotStat(property) {
        var baseValue = 0;

        if(this.activePlot && property(this.activePlot.card)) {
            baseValue = property(this.activePlot.card);
        }

        var modifier = _.chain(this.cardsInPlay).map(cip => {
            return [cip.card].concat(cip.attachments);
        }).flatten(true).reduce((memo, card) => {
            return memo + (property(card) || 0);
        }, 0);

        return baseValue + modifier;
    }

    getTotalInitiative() {
        return this.getTotalPlotStat(card => {
            return card.initiative;
        });
    }

    getTotalIncome() {
        return this.getTotalPlotStat(card => {
            return card.income;
        });
    }

    getTotalReserve() {
        return this.getTotalPlotStat(card => {
            return card.reserve;
        });
    }

    getState(isActivePlayer) {
        var cardsInPlay = _.map(this.cardsInPlay, card => {
            var mappedCard;

            if(isActivePlayer || !card.facedown) {
                mappedCard = _.omit(card, 'attachments');

                mappedCard.attachments = _.map(card.attachments, a => {
                    return _.omit(a, 'parent');
                });

                return mappedCard;
            }

            return { facedown: true, card: {}, dupes: [] };
        });

        var state = {
            id: this.id,
            faction: this.deck.faction,
            agenda: this.deck.agenda,
            numDrawCards: this.drawDeck.length,
            hand: isActivePlayer ? this.hand : _.map(this.hand, () => {
                return {};
            }),
            buttons: isActivePlayer ? this.buttons : undefined,
            menuTitle: isActivePlayer ? this.menuTitle : undefined,
            gold: !isActivePlayer && this.phase === 'setup' ? 0 : this.gold,
            power: this.power,
            totalPower: this.getTotalPower(),
            reserve: this.reserve,
            claim: this.claim,
            phase: this.phase,
            cardsInPlay: cardsInPlay,
            plotDeck: isActivePlayer ? this.plotDeck : undefined,
            numPlotCards: this.plotDeck.length,
            plotSelected: !!this.selectedPlot,
            activePlot: this.activePlot,
            firstPlayer: this.firstPlayer,
            plotDiscard: this.plotDiscard,
            selectedAttachment: this.selectedAttachment,
            selectCard: this.selectCard,
            deadPile: this.deadPile,
            discardPile: this.discardPile
        };

        if(this.showDeck) {
            state.showDeck = true;
            state.drawDeck = this.drawDeck;
        }

        return state;
    }
}

module.exports = Player;
