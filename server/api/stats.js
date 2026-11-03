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
            let months;
            let month = req.query.month;
            let stats;

            if (month) {
                // Independent, so run them together rather than making a cached month wait for the list
                [months, stats] = await Promise.all([
                    userStatsService.getMonths(req.user.id),
                    userStatsService.getMonth(req.user.id, month)
                ]);
            } else {
                // Without a month, show the latest one with games
                months = await userStatsService.getMonths(req.user.id);
                month = months[0];

                if (!month) {
                    return res.send({ success: true, months: [], month: null, stats: null });
                }

                stats = await userStatsService.getMonth(req.user.id, month);
            }

            if (!stats) {
                return res.status(400).send({ success: false, message: 'Invalid month' });
            }

            res.send({ success: true, months, month, stats });
        })
    );

    server.get(
        '/api/wrapped/:year',
        passport.authenticate('jwt', { session: false }),
        wrapAsync(async function (req, res) {
            const year = Number(req.params.year);
            const wrapped = Number.isInteger(year)
                ? await wrappedService.getForUser(req.user.id, year)
                : null;

            if (!wrapped) {
                return res
                    .status(404)
                    .send({ success: false, message: 'No Wrapped for this year' });
            }

            res.send({ success: true, wrapped });
        })
    );
};
