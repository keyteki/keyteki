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
        return this.packs.find({}).catch(err => {
            logger.info(err);
        });
    }
}

module.exports = CardService;

