const _ = require('underscore');

class Player {
    constructor(player) {
        this.drawCards = [];
        this.plotCards = [];
        this.drawDeck = [];
        this.hand = [];

        this.id = player.id.slice(2);
        this.deck = player.deck;

        this.name = player.name;

        _.each(player.deck.drawCards, card => {
            for(var i = 0; i < card.count; i++) {
                this.drawCards.push(card.card);
            }
        });

        _.each(player.deck.plotCards, card => {
            for(var i = 0; i < card.count; i++) {
                this.plotCards.push(card.card);
            }
        });

        this.takenMulligan = false;
    }

    drawCardsToHand(numCards) {
        this.hand = this.hand.concat(_.first(this.drawDeck, numCards));
        this.drawDeck = _.rest(this.drawDeck, numCards);
    }

    initDrawDeck() {
        this.drawDeck = _.shuffle(this.drawCards);
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
            return;
        }

        this.initDrawDeck();
        this.takenMulligan = true;

        this.buttons = [];
        this.menuTitle = 'Waiting for opponent to keep hand or mulligan';

        this.readyToStart = true;
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
            return handCard.code === card.code;
        })) {
            return false;
        }

        var isDupe = this.isDuplicateInPlay(card);

        if(card.cost > this.gold && !isDupe) {
            return false;
        }

        if(this.limitedPlayed && this.isLimited(card) && !isDupe) {
            return false;
        }

        if(card.type_code === 'event') {
            return false;
        }

        if(card.type_code === 'attachment') {
            var attachments = _.filter(this.cardsInPlay, playCard => {
                return playCard.card.type_code === 'attachment';
            }).length;

            var characters = _.filter(this.cardsInPlay, playCard => {
                return playCard.card.type_code === 'character';
            }).length;

            if((attachments === 0 && characters === 0) || attachments >= characters) {
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

    isLimited(card) {
        return card.text.indexOf('Limited.') !== -1;
    }

    removeFromHand(card) {
        var removed = false;

        this.hand = _.reject(this.hand, handCard => {
            if(handCard.code === card.code && !removed) {
                removed = true;

                return true;
            }

            return false;
        });
    }

    playCard(card) {
        if(!this.canPlayCard(card)) {
            return;
        }

        var isDupe = this.isDuplicateInPlay(card);

        if(!isDupe) {
            this.gold -= card.cost;
        }

        if(card.type_code === 'attachment' && this.phase !== 'setup') {
            this.selectedAttachment = card;
            this.selectCard = true;
            this.menuTitle = 'Select target for attachment';
            return;
        }

        if(isDupe && this.phase !== 'setup') {
            var dupe = _.find(this.cardsInPlay, c => {
                return card.code === c.card.code;
            });

            dupe.dupes.push(card);
        } else {
            this.cardsInPlay.push({
                facedown: this.phase === 'setup', card: card, attachments: [], dupes: []
            });
        }

        if(this.isLimited(card)) {
            this.limitedPlayed = true;
        }

        this.removeFromHand(card);
    }

    setupDone() {
        this.setup = true;
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

        var processedCards = [];

        _.each(this.cardsInPlay, card => {
            card.facedown = false;

            var dupe = _.find(processedCards, c => {
                return c.card.code === card.card.code;
            });

            if(dupe) {
                dupe.dupes.push(card);
            } else {
                processedCards.push(card);
            }
        });

        this.cardsInPlay = processedCards;
    }

    selectPlot(plot) {
        this.selectedPlot = { facedown: true, card: plot };
    }

    revealPlot() {
        this.selectedPlot.facedown = false;

        this.menuTitle = '';
        this.buttons = [];

        this.drawCardsToHand(7 - this.hand.length);
        this.plotDiscard.push(this.selectedPlot.card);
        this.plotDeck = _.reject(this.plotDeck, card => {
            return card.code === this.selectedPlot.card.code;
        });

        this.activePlot = this.selectedPlot;
        this.plotRevealed = true;

        this.selectedPlot = undefined;
    }

    drawPhase() {
        this.gold = 0;
        this.phase = 'draw';
        this.drawCardsToHand(2);
    }

    beginMarshal() {
        this.phase = 'marshal';

        this.buttons = [{ command: 'donemarshal', text: 'Done' }];
        this.menuTitle = 'Marshal your cards';

        this.gold += this.activePlot.card.income;
        this.reserve = this.activePlot.card.reserve;
        this.claim = this.activePlot.card.claim;

        this.limitedPlayed = false;
        this.marshalled = false;
    }

    hasUnmappedAttachments() {
        return _.any(this.cardsInPlay, card => {
            return card.card.type_code === 'attachment';
        });
    }

    attach(attachment, card) {
        var inPlayCard = _.find(this.cardsInPlay, c => {
            return c.card.code === card.code;
        });

        inPlayCard.attachments.push(attachment);

        this.cardsInPlay = _.reject(this.cardsInPlay, c => {
            return c.card.code === attachment.code;
        });

        this.selectCard = false;
        this.selectedAttachment = undefined;
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

    getTargetList(source) {
        switch(source) {
            case 'hand':
                return this.hand;
            case 'draw deck':
                return this.drawDeck;
            case 'discard pile':
                return this.discardPile;
            case 'dead pile':
                return this.deadPile;
        }
    }

    updateTargetList(source, targetList) {
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
        }
    }

    doCardMove(card, targetList) {
        var matchFound = false;
        targetList = _.reject(targetList, c => {
            var match = !matchFound && c.code === card.code;

            if(match) {
                matchFound = true;
            }

            return match;
        });

        return targetList;
    }

    doHandDrop(card, source) {
        var targetList = this.getTargetList(source);

        if(!_.any(targetList, c => {
            return c.code === card.code;
        })) {
            return false;
        }

        this.hand.push(card);

        targetList = this.doCardMove(card, targetList);

        this.updateTargetList(source, targetList);

        return true;
    }

    doDiscardDrop(card, source) {
        var targetList = this.getTargetList(source);

        if(!_.any(targetList, c => {
            return c.code === card.code;
        })) {
            return false;
        }

        this.discardPile.push(card);

        targetList = this.doCardMove(card, targetList);
        this.updateTargetList(source, targetList);

        return true;
    }

    drop(card, source, target) {
        if(!this.isValidDropCombination(source, target)) {
            return false;
        }

        switch(target) {
            case 'hand':
                return this.doHandDrop(card, source);
            case 'discard pile':
                return this.doDiscardDrop(card, source);
        }

        return false;
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
    }

    startChallenge(challengeType) {
        this.menuTitle = 'Select challenge targets';
        this.buttons = [
            { text: 'Done', command: 'donechallenge' }
        ];

        this.currentChallenge = challengeType;
        this.selectCard = true;
        this.challenger = true;
    }

    addToChallenge(card) {
        if(this.currentChallenge === 'military' && !card.is_military) {
            return;
        }

        if(this.currentChallenge === 'intrigue' && !card.is_intrigue) {
            return;
        }

        if(this.currentChallenge === 'power' && !card.is_power) {
            return;
        }

        var inPlay = _.find(this.cardsInPlay, c => {
            return c.card.code === card.code;
        });

        if(!inPlay) {
            return;
        }

        inPlay.selected = !inPlay.selected;
    }

    doneChallenge() {
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
    }

    beginDefend(challenge) {
        this.menuTitle = 'Select defenders';
        this.buttons = [
            { text: 'Done', command: 'donedefend' }
        ];

        this.selectCard = true;
        this.currentChallenge = challenge;
        this.phase = 'challenge';
    }

    selectCharacterToKill() {
        this.selectCard = true;
        this.phase = 'claim';

        this.menuTitle = 'Select character to kill';
        this.buttons = [
        ];
    }

    killCharacter(card) {
        var character = _.find(this.cardsInPlay, c => {
            return c.card.code === card.code;
        });

        if(character.dupes.length > 0) {
            character.dupes = character.dupes.slice(1);
        } else {
            this.cardsInPlay = _.reject(this.cardsInPlay, c => {
                return c.card.code === card.code;
            });

            this.deadPile.push(card);
        }

        this.claimToDo--;
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

    getState(isActivePlayer) {
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
            totalPower: this.power,
            reserve: this.reserve,
            claim: this.claim,
            phase: this.phase,
            cardsInPlay: this.cardsInPlay,
            plotDeck: isActivePlayer ? this.plotDeck : undefined,
            numPlotCards: this.plotDeck.length,
            plotSelected: !!this.selectedPlot,
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
