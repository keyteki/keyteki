const _ = require('underscore');

const cards = require('./cards');
const DrawCard = require('./drawcard.js');
const ProvinceCard = require('./provincecard.js');

class Deck {
    constructor(data) {
        this.data = data;
    }

    prepare(player) {
        var result = {
            conflictDrawCards: [],
            dynastyDrawCards: [],
            provinceCards: []
        };

        //conflict
        this.eachRepeatedCard(this.data.drawCards, cardData => {
            if(['conflict'].includes(cardData.deck)) {
                var drawCard = this.createCard(DrawCard, player, cardData);
                drawCard.location = 'conflict draw deck';
                result.conflictDrawCards.push(drawCard);
            }
        });

        //dynasty
        this.eachRepeatedCard(this.data.drawCards, cardData => {
            if(['dynsaty'].includes(cardData.deck)) {
                var drawCard = this.createCard(DrawCard, player, cardData);
                drawCard.location = 'dynasty draw deck';
                result.dynastyDrawCards.push(drawCard);
            }
        });

        this.eachRepeatedCard(this.data.provinceCards, cardData => {
            if(cardData.type_code === 'province') {
                var provinceCard = this.createCard(ProvinceCard, player, cardData);
                provinceCard.location = 'province deck';
                result.provinceCards.push(provinceCard);
            }
        });

        if(this.data.stronghold) {
            result.stronghold = new DrawCard(player, _.extend({
                code: this.data.stronghold.value,
                type_code: 'stronghold',
                stronghold_code: this.data.stronghold.value
            }, this.data.stronghold));
        } else {
            result.stronghold = new DrawCard(player, { type_code: 'stronghold' });
        }
        result.stronghold.moveTo('stronghold');

        result.allCards = [result.stronghold].concat(result.drawCards).concat(result.plotCards);

        return result;
    }

    eachRepeatedCard(cards, func) {
        _.each(cards, cardEntry => {
            for(var i = 0; i < cardEntry.count; i++) {
                func(cardEntry.card);
            }
        });
    }

    createCard(baseClass, player, cardData) {
        var cardClass = cards[cardData.code] || baseClass;
        return new cardClass(player, cardData);
    }
}

module.exports = Deck;
