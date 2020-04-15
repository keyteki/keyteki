const ChallongeService = require('../services/ChallongeService.js');
const logger = require('../log.js');
const passport = require('passport');
const { wrapAsync } = require('../util.js');

let challongeService = new ChallongeService();

module.exports.init = function(server) {
    server.get('/api/challonge/tournaments/', passport.authenticate('jwt', { session: false }), wrapAsync(async function(req, res) {
        challongeService.getTournamentsForUser({ ...req.user })
            .then(tournaments => {
                res.send({ success: true, tournaments });
            })
            .catch(err => {
                logger.error(err);
                res.send({ success: false, message: 'Error loading tournaments' });
            });
    }));

    server.post('/api/challonge/matches/', passport.authenticate('jwt', { session: false }), wrapAsync(async function(req, res) {
        challongeService.getMatches({ ...req.user }, req.body.data)
            .then(data => {
                res.send({ success: true, data });
            })
            .catch(err => {
                logger.error(err);
                res.send({ success: false, message: 'Error loading matches' });
            });
    }));
};
