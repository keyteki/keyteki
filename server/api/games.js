import passport from 'passport';
import GameService from '../services/GameService.js';
import { wrapAsync } from '../util.js';

let gameService = new GameService();

export function init(server) {
    server.get(
        '/api/games',
        passport.authenticate('jwt', { session: false }),
        wrapAsync(async function (req, res) {
            let games = await gameService.findByUserName(req.user.username);
            res.send({ success: true, games: games });
        })
    );
}
