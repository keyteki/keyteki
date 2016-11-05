const _ = require('underscore');

class Player {
    constructor(player) {
        this.drawCards = [];
        this.plotCards = [];
        this.drawDeck = [];
        this.hand = [];

        this.id = player.id;
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

        if(this.limitedPlayed && this.hasKeyword(card, 'Limited') && !isDupe) {
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
            if(handCard.code === card.code && !removed) {
                removed = true;

                return true;
            }

            return false;
        });
    }

    discardFromDraw(number) {
        this.drawDeck.slice(number);
    }

    playCard(card, dragDrop) {
        if(!dragDrop && !this.canPlayCard(card)) {
            return;
        }

        var isDupe = this.isDuplicateInPlay(card);

        if(!isDupe && !dragDrop) {
            this.gold -= card.cost;
        }

        if(!dragDrop && card.type_code === 'attachment' && this.phase !== 'setup') {
            this.selectedAttachment = card;
            this.selectCard = true;
            this.menuTitle = 'Select target for attachment';
            return;
        }

        if(isDupe && this.phase !== 'setup' && !dragDrop) {
            var dupe = _.find(this.cardsInPlay, c => {
                return card.code === c.card.code;
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
                dupe.dupes.push(card);
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

        if(this.plotDeck.length === 0) {
            this.plotDeck = this.plotDiscard;
            this.plotDiscard = [];
        }

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
            return card.code === plot.code;
        })) {
            return false;
        }

        this.selectedPlot = { facedown: true, card: plot };

        return true;
    }

    revealPlot() {
        this.selectedPlot.facedown = false;

        this.menuTitle = '';
        this.buttons = [];

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
            case 'play area':
                return this.cardsInPlay;
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
            case 'play area':
                this.cardsInPlay = targetList;
        }
    }

    doCardMove(card, targetList) {
        var matchFound = false;
        targetList = _.reject(targetList, c => {
            var match = false;

            if(c.card) {
                match = !matchFound && c.card.code === card.code;
            } else {
                match = !matchFound && c.code === card.code;
            }

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
            if(c.card) {
                return c.card.code === card.code;
            }

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
            if(c.card) {
                return c.card.code === card.code;
            }

            return c.code === card.code;
        })) {
            return false;
        }

        this.discardPile.push(card);

        targetList = this.doCardMove(card, targetList);
        this.updateTargetList(source, targetList);

        return true;
    }

    doDeadDrop(card, source) {
        var targetList = this.getTargetList(source);

        if(!_.any(targetList, c => {
            if(c.card) {
                return c.card.code === card.code;
            }

            return c.code === card.code;
        })) {
            return false;
        }

        this.deadPile.push(card);

        targetList = this.doCardMove(card, targetList);
        this.updateTargetList(source, targetList);

        return true;
    }

    doInPlayDrop(card, source) {
        var targetList = this.getTargetList(source);

        if(!_.any(targetList, c => {
            if(c.card) {
                return c.card.code === card.code;
            }

            return c.code === card.code;
        })) {
            return false;
        }

        this.playCard(card, true);

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
            case 'dead pile':
                return this.doDeadDrop(card, source);
            case 'play area':
                return this.doInPlayDrop(card, source);
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

        this.cardsInChallenge = [];
        _.each(this.cardsInPlay, card => {
            card.stealth = undefined;
        });
        this.selectCard = false;
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

        var inPlay = _.find(this.cardsInPlay, c => {
            return c.card.code === card.code;
        });

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

        var inPlay = _.find(this.cardsInPlay, c => {
            return c.card.code === card.code;
        });

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
        }
        else {
            this.cardsInChallenge = _.reject(this.cardsInChallenge, c => {
                return c.card.code === card.card.code;
            });
        }
    }

    doneChallenge(myChallenge) {
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
            var found = false;

            this.cardsInPlay = _.reject(this.cardsInPlay, c => {
                if(!found && c.card.code === card.code) {
                    found = true;

                    return true;
                }

                return false;
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

    discardCard(card) {
        var cardInPlay = _.find(this.cardsInPlay, c => {
            return c.card.code === card.code;
        });

        if(!cardInPlay) {
            return;
        }

        _.each(cardInPlay.dupes, dupe => {
            this.discardPile.push(dupe.card);
        });

        _.each(cardInPlay.attachments, attachment => {
            if(this.hasKeyword(attachment, 'Terminal')) {
                this.discardPile.push(attachment);
            } else {
                this.hand.push(attachment);
            }    
        });

        this.cardsInPlay = _.reject(this.cardsInPlay, c => {
            return c.card.code === card.code;
        });

        this.discardPile.push(card);
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
            power: this.power,
            totalPower: this.getTotalPower(),
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
