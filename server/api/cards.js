const config = require('config');
const CardService = require('../repositories/cardService.js');

var cardService = new CardService({ dbPath: config.dbPath });

module.exports.init = function(server) {
    server.get('/api/cards', function(req, res, next) {
        cardService.getAllCards({ shortForm: true })
            .then(cards => {
                res.send({ success: true, cards: cards });
            })
            .catch(err => {
                return next(err);
            });
    });

    server.get('/api/packs', function(req, res, next) {
        cardService.getAllPacks()
            .then(packs => {
                res.send({ success: true, packs: packs });
            })
            .catch(err => {
                return next(err);
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
