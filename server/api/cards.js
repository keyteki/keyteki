const monk = require('monk');
const config = require('config');
const CardService = require('../services/CardService.js');

let db = monk(config.dbPath);
let cardService = new CardService(db);

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
            { name: 'Brobnar', value: 'brobnar' },
            { name: 'Dis', value: 'dis' },
            { name: 'Logos', value: 'logos' },
            { name: 'Mars', value: 'mars' },
            { name: 'Sanctum', value: 'sanctum' },
            { name: 'Shadows', value: 'shadows' },
            { name: 'Untamed', value: 'untamed' }
        ];
        res.send({ success: true, factions: factions });
    });
};
