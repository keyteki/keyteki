const logger = require('../log.js');
const db = require('../db');

class CardService {
    replaceCards(cards) {
        return this.cards.remove({})
            .then(() => this.cards.insert(cards));
    }

    async getAllCards(options) {
        let cards;

        try {
            cards = await db.query('SELECT * FROM "Cards"');
        } catch(err) {
            logger.error('Failed to lookup cards', err);

            return [];
        }

        let retCards = {};

        for(let card of cards) {
            retCards[card.Id] = this.mapCard(card, options);
        }

        return this.cards.find({})
            .then(result => {
                let cards = {};

                _.each(result, card => {
                    if(options && options.shortForm) {
                        cards[card.id] = _.pick(card, 'id', 'name', 'type', 'house', 'rarity', 'number', 'image', 'amber', 'locale', 'traits');
                    } else {
                        cards[card.id] = card;
                    }
                });

                return cards;
            }).catch(err => {
                logger.info(err);
            });
    }

    mapCard(card, options) {
        return {

        };
    }
}

module.exports = CardService;
