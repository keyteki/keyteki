const config = require('../config.js');
const logger = require('../log.js');
const CardRepository = require('../repositories/cardRepository.js');

var cardRepository = new CardRepository(config.dbPath);

module.exports.init = function(server) {
    server.get('/api/cards', function(req, res, next) {
        cardRepository.getCards({ shortForm: true }, (err, cards) => {
            if(err) {
                logger.info(err);
                return next(err);
            }

            res.send({ success: true, cards: cards });
        });
    });

    server.get('/api/packs', function(req, res, next) {
        cardRepository.getPacks((err, data) => {
            if(err) {
                logger.info(err);
                return next(err);
            }

            res.send({ success: true, packs: data });
        });
    });

    server.get('/api/factions', function(req, res) {
        let factions = [
                { name: 'Crab Clan', value: 'crab' },
                { name: 'Crane Clan', value: 'crane' },
                { name: 'Dragon Clan', value: 'dragon' },
                { name: 'Lion Clan', value: 'lion' },
                { name: 'Phoenix Clan', value: 'phoenix' },
                { name: 'Scorpion Clan', value: 'scorpion' },
                { name: 'Unicorn Clan', value: 'unicorn' }
        ];
        res.send({ success: true, factions: factions });
    });
};
