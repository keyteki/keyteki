const _ = require('underscore');

const monk = require('monk');
const logger = require('../log.js');

class CardService {
    constructor(options) {
        let db = monk(options.dbPath);

        this.cards = db.get('cards');
        this.packs = db.get('packs');
    }
    
    getAllCards(options) {
        return this.cards.find({})
            .then(result => {
                let cards = {};
                
                _.each(result, card => {
                    if(options && options.shortForm) {
                        cards[card.id] = _.pick(card, 'id', 'name', 'type', 'clane', 'deck_limit', 'pack_cards', 'unicity', 'side', 'influence_cost');
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

