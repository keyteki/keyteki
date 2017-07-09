const _ = require('underscore');

const db = require('monk')('mongodb://127.0.0.1:27017/throneteki');
const cards = db.get('cards');
const packs = db.get('packs');
const logger = require('../log.js');

class CardService {
    getAllCards(options) {
        return cards.find({})
            .then(result => {
                let cards = {};
                
                _.each(result, card => {
                    if(options && options.shortForm) {
                        cards[card.code] = _.pick(card, 'code', 'name', 'label', 'type_code', 'type_name', 'is_loyal', 'faction_code', 'deck_limit', 'pack_code');
                    } else {
                        cards[card.code] = card;
                    }
                });

                return cards;
            }).catch(err => {
                logger.info(err);
            });
    }

    getAllPacks() {
        return packs.find({}).catch(err => {
            logger.info(err);
        });
    }
}

module.exports = CardService;

