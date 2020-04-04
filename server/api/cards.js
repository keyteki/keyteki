const Constants = require('../constants.js');
const CardService = require('../services/CardService.js');

let cardService = new CardService();

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

    server.get('/api/factions', function(req, res) {
        let factions = Constants.Houses.map(function(house, i) {
            return { name: Constants.HousesNames[i], value: house };
        });
        res.send({ success: true, factions: factions });
    });
};
