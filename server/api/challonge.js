const ChallongeService = require('../services/ChallongeService.js');
const logger = require('../log.js');
const passport = require('passport');
const { wrapAsync } = require('../util.js');

let challongeService = new ChallongeService();

module.exports.init = function(server) {
    server.get('/api/challonge/tournaments/', passport.authenticate('jwt', { session: false }), wrapAsync(async function(req, res) {
        let data;
        try {
            data = await challongeService.getTournamentsForUser({ ...req.user });
        } catch(error) {
            logger.error(error);
            res.send({ success: false, message: 'Error loading tournaments' });
        }

        res.send({ success: true, data, message: 'Tournaments refreshed' });
    }));

    server.post('/api/challonge/matches/', passport.authenticate('jwt', { session: false }), wrapAsync(async function(req, res) {
        let data;
        try {
            data = await challongeService.getMatches({ ...req.user }, req.body.data);
        } catch(error) {
            logger.error(error);
            res.send({ success: false, message: 'Error loading matches' });
        }

        res.send({ success: true, data, message: 'Matches refreshed' });
    }));

    server.post('/api/challonge/participants/', passport.authenticate('jwt', { session: false }), wrapAsync(async function(req, res) {
        let data;
        try {
            data = await challongeService.getParticipants({ ...req.user }, req.body.data);
        } catch(error) {
            logger.error(error);
            res.send({ success: false, message: 'Error loading matches' });
        }

        res.send({ success: true, data });
    }));

    server.post('/api/challonge/fullTournament/', passport.authenticate('jwt', { session: false }), wrapAsync(async function(req, res) {
        let participants, matches;
        try {
            participants = await challongeService.getParticipants({ ...req.user }, req.body.data);
            matches = await challongeService.getMatches({ ...req.user }, req.body.data);
        } catch(error) {
            logger.error(error);
            res.send({ success: false, message: 'Error loading matches' });
        }

        res.send({ success: true, participants, matches, message: 'Tournament fetched' });
    }));

    server.post('/api/challonge/attachMatchLink', passport.authenticate('jwt', { session: false }), wrapAsync(async function(req, res) {
        let data;
        try {
            data = await challongeService.attachMatchLink({ ...req.user }, req.body);
        } catch(error) {
            logger.error(error);
            res.send({ success: false, message: 'Error attaching match links' });
        }

        res.send({ success: true, attachments: data, message: 'Match links sent' });
    }));
};
