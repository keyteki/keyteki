import Constants from '../constants.js';
import ServiceFactory from '../services/ServiceFactory.js';
import ConfigService from '../services/ConfigService.js';

const cardService = ServiceFactory.cardService(new ConfigService());

export function init(server) {
    server.get('/api/cards', function (req, res, next) {
        cardService
            .getAllCards({ shortForm: true })
            .then((cards) => {
                res.send({ success: true, cards: cards });
            })
            .catch((err) => {
                return next(err);
            });
    });

    server.get('/api/factions', function (req, res) {
        let factions = Constants.Houses.map(function (house, i) {
            return { name: Constants.HousesNames[i], value: house };
        });
        res.send({ success: true, factions: factions });
    });
}
