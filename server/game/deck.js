const _ = require('underscore');

const cards = require('./cards');
const Card = require('./Card.js');
const logger = require('../log.js');

class Deck {
    constructor(data) {
        if(!data) {
            return;
        }

        data.cards = data.cards.map(card => {
            let result = {
                count: card.count,
                card: card.card
            };
            if(!result.card) {
                logger.error('Corrupt deck', card.id, card);
                return result;
            }

            return result;
        });

        this.data = data;
    }

    prepare(player) {
        var result = {
            factions: [],
            cards: []
        };

        result.factions = this.data.factions;

        this.eachRepeatedCard(this.data.cards, cardData => {
            let card = this.createCard(player, cardData);
            if(card) {
                card.setupAbilities();
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
        }

        cardData.image = cardData.id;

        if(!cards[cardData.id]) {
            return new Card(player, cardData);
        }

        let cardClass = cards[cardData.id];
        return new cardClass(player, cardData);
    }
}

module.exports = Deck;
