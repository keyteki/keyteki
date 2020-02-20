const monk = require('monk');
const passport = require('passport');

const ConfigService = require('../services/ConfigService');
const GameService = require('../services/GameService.js');
const { wrapAsync } = require('../util.js');

const configService = new ConfigService();

let db = monk(configService.getValue('dbPath'));
let gameService = new GameService(db);

module.exports.init = function(server) {
    server.get('/api/games', passport.authenticate('jwt', { session: false }), wrapAsync(async function(req, res) {
        let games = await gameService.findByUserName(req.user.username);
        res.send({ success: true, games: games });
    }));
};
