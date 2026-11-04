const passport = require('passport');

const UserStatsService = require('../services/UserStatsService.js');
const WrappedService = require('../services/WrappedService.js');
const { wrapAsync } = require('../util.js');

let userStatsService = new UserStatsService();
let wrappedService = new WrappedService();

module.exports.init = function (server) {
    server.get(
        '/api/stats/monthly',
        passport.authenticate('jwt', { session: false }),
        wrapAsync(async function (req, res) {
            const months = await userStatsService.getMonths(req.user.id);
            // Without a month, show the latest one with games
            const month = req.query.month === undefined ? months[0] : req.query.month;

            if (!month) {
                return res.send({ success: true, months: [], month: null, stats: null });
            }

            // Only months with games, so nobody can make the server work out (and cache) arbitrary months
            if (!months.includes(month)) {
                return res.status(400).send({ success: false, message: 'Invalid month' });
            }

            const stats = await userStatsService.getMonth(req.user.id, month);

            res.send({ success: true, months, month, stats });
        })
    );

    server.get(
        '/api/wrapped/:year',
        passport.authenticate('jwt', { session: false }),
        wrapAsync(async function (req, res) {
            const result = await wrappedService.getForUser(req.user.id, req.params.year);

            if (!result) {
                return res
                    .status(404)
                    .send({ success: false, message: 'No Wrapped for this year' });
            }

            if (result.expired) {
                return res
                    .status(410)
                    .send({ success: false, message: 'This Wrapped is no longer available' });
            }

            res.send({ success: true, wrapped: result.wrapped });
        })
    );
};
