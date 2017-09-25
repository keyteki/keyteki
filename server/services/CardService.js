const _ = require('underscore');

const logger = require('../log.js');

class CardService {
    constructor(db) {
        this.cards = db.get('cards');
        this.packs = db.get('packs');
    }

    replaceCards(cards) {
        return this.cards.remove({})
            .then(() => this.cards.insert(cards));
    }

    replacePacks(cards) {
        return this.packs.remove({})
            .then(() => this.packs.insert(cards));
    }

    getAllCards(options) {
        return this.cards.find({})
            .then(result => {
                let cards = {};
                
                _.each(result, card => {
                    if(options && options.shortForm) {
                        cards[card.id] = _.pick(card, 'id', 'name', 'type', 'clan', 'side', 'deck_limit', 'element', 'unicity', 'influence_cost', 'influence_pool', 'pack_cards');
                    } else {
                        cards[card.id] = card;
                    }
                });

                return cards;
            }).catch(err => {
                logger.info(err);
            });
    }

    getAllPacks() {
        return this.packs.find({}).catch(err => {
            logger.info(err);
        });
    }
}

module.exports = CardService;

