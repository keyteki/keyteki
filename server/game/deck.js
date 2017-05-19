const _ = require('underscore');

const cards = require('./cards');
const DrawCard = require('./drawcard.js');
const PlotCard = require('./plotcard.js');

class Deck {
    constructor(data) {
        this.data = data;
    }

    prepare(player) {
        var result = {
            conflictdrawCards: [],
            dynastydrawCards: [],
            provinceCards: []
        };

        this.eachRepeatedCard(this.data.drawCards, cardData => {
            if(['attachment', 'character', 'event', 'location'].includes(cardData.type_code)) {
                var drawCard = this.createCard(DrawCard, player, cardData);
                drawCard.location = 'draw deck';
                result.drawCards.push(drawCard);
            }
        });

        this.eachRepeatedCard(this.data.plotCards, cardData => {
            if(cardData.type_code === 'plot') {
                var plotCard = this.createCard(PlotCard, player, cardData);
                plotCard.location = 'plot deck';
                result.plotCards.push(plotCard);
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
