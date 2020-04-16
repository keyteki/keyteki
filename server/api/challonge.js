const ChallongeService = require('../services/ChallongeService.js');
const logger = require('../log.js');
const passport = require('passport');
const { wrapAsync } = require('../util.js');

let challongeService = new ChallongeService();

module.exports.init = function(server) {
    server.get('/api/challonge/tournaments/', passport.authenticate('jwt', { session: false }), wrapAsync(async function(req, res) {
        challongeService.getTournamentsForUser({ ...req.user })
            .then(data => {
                res.send({ success: true, data });
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

    server.post('/api/challonge/participants/', passport.authenticate('jwt', { session: false }), wrapAsync(async function(req, res) {
        challongeService.getParticipants({ ...req.user }, req.body.data)
            .then(data => {
                res.send({ success: true, data });
            })
            .catch(err => {
                logger.error(err);
                res.send({ success: false, message: 'Error loading matches' });
            });
    }));

    server.post('/api/challonge/createAttachment', passport.authenticate('jwt', { session: false }), wrapAsync(async function(req, res) {
        challongeService.createAttachment({ ...req.user }, req.body)
            .then(data => {
                res.send({ success: true, data });
            })
            .catch(err => {
                logger.error(err);
                res.send({ success: false, message: 'Error loading matches' });
            });
    }));
};
