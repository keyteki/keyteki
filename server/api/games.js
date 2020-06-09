const passport = require('passport');

const GameService = require('../services/GameService.js');
const { wrapAsync } = require('../util.js');

let gameService = new GameService();

module.exports.init = function (server) {
    server.get(
        '/api/games',
        passport.authenticate('jwt', { session: false }),
        wrapAsync(async function (req, res) {
            let games = await gameService.findByUserName(req.user.username);
            res.send({ success: true, games: games });
        })
    );
};
