const ChallongeService = require('../services/ChallongeService.js');
const logger = require('../log.js');
const passport = require('passport');
const { wrapAsync } = require('../util.js');

let challongeService = new ChallongeService();

module.exports.init = function(server) {
    server.get('/api/challonge/tournaments/', passport.authenticate('jwt', { session: false }), wrapAsync(async function(req, res) {
        challongeService.getTournamentsForUser({ ...req.user })
            .then(data => {
                res.send({ success: true, data, message: 'Tournaments refreshed' });
            })
            .catch(err => {
                logger.error(err);
                res.send({ success: false, message: 'Error loading tournaments' });
            });
    }));

    server.post('/api/challonge/matches/', passport.authenticate('jwt', { session: false }), wrapAsync(async function(req, res) {
        challongeService.getMatches({ ...req.user }, req.body.data)
            .then(data => {
                res.send({ success: true, data, message: 'Matches refreshed' });
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

    server.post('/api/challonge/fullTournament/', passport.authenticate('jwt', { session: false }), wrapAsync(async function(req, res) {
        const participants = challongeService.getParticipants({ ...req.user }, req.body.data);
        const matches = challongeService.getMatches({ ...req.user }, req.body.data);
        Promise.all([participants, matches])
            .then(([participants, matches]) => {
                res.send({ success: true, participants, matches, message: 'Tournament fetched' });
            })
            .catch(err => {
                logger.error(err);
                res.send({ success: false, message: 'Error loading matches' });
            });
    }));

    server.post('/api/challonge/attachMatchLink', passport.authenticate('jwt', { session: false }), wrapAsync(async function(req, res) {
        challongeService.attachMatchLink({ ...req.user }, req.body)
            .then(data => {
                res.send({ success: true, attachments: data, message: 'Match links sent' });
            })
            .catch(err => {
                logger.error(err);
                res.send({ success: false, message: 'Error attaching match links' });
            });
    }));
};
