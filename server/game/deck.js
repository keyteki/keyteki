const _ = require('underscore');

const cards = require('./cards');
const Card = require('./Card.js');

class Deck {
    constructor(data) {
        this.data = data;
    }

    prepare(player) {
        var result = {
            houses: [],
            cards: []
        };

        result.houses = this.data.houses;

        this.eachRepeatedCard(this.data.cards, cardData => {
            let splitId = cardData.id.split('_');
            if(splitId.length > 1) {
                cardData.house = splitId[1];
                cardData.id = splitId[0];
            }
            let card = this.createCard(Card, player, cardData);
            card.location = 'deck';
            result.cards.push(card);
        });

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
        var cardClass = cards[cardData.id] || baseClass;
        return new cardClass(player, cardData);
    }
}

module.exports = Deck;
