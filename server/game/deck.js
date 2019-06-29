const _ = require('underscore');

const cards = require('./cards');
const Card = require('./Card.js');
const logger = require('../log.js');

class Deck {
    constructor(data) {
        data.cards = data.cards.map(card => {
            let result = {
                count: card.count,
                card: card.card
            };
            if(!result.card) {
                logger.error('Corrupt deck', card.id, card);
                return result;
            }
            if(card.maverick) {
                result.card.house = card.maverick;
                result.card.image = card.id + '_' + card.maverick;
            } else {
                result.card.image = card.id;
            }
            return result;
        });

        this.data = data;
    }

    prepare(player) {
        var result = {
            houses: [],
            cards: []
        };

        result.houses = this.data.houses;

        this.eachRepeatedCard(this.data.cards, cardData => {
            let card = this.createCard(player, cardData);
            if(card) {
                card.location = 'deck';
                result.cards.push(card);
            }
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

    createCard(player, cardData) {
        if(!cardData || !cardData.id) {
            logger.error('no cardData for ' + JSON.stringify(this.data));
            return;
        } else if(!cards[cardData.id]) {
            return new Card(player, cardData);
        }
        var cardClass = cards[cardData.id];
        return new cardClass(player, cardData);
    }
}

module.exports = Deck;
