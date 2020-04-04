const monk = require('monk');
const passport = require('passport');

const BanlistService = require('../services/BanlistService');
const ConfigService = require('../services/ConfigService');
const { wrapAsync } = require('../util');

let configService = new ConfigService();
let db = monk(configService.getValue('dbPath'));

let banlistService = new BanlistService(db);

module.exports.init = function(server) {
    server.get('/api/banlist', passport.authenticate('jwt', { session: false }), wrapAsync(async function(req, res) {
        if(!req.user.permissions || !req.user.permissions.canManageBanlist) {
            return res.status(403);
        }

        let banlist = await banlistService.getBanList();

        return res.send({ success: true, banlist: banlist });
    }));

    server.post('/api/banlist', passport.authenticate('jwt', { session: false }), wrapAsync(async function(req, res) {
        if(!req.user.permissions || !req.user.permissions.canManageBanlist) {
            return res.status(403);
        }

        let entry = await banlistService.getEntryByIp(req.body.ip);
        if(entry) {
            return res.status(400).send({ success: false, message: 'Already exists' });
        }

        entry = {
            ip: req.body.ip,
            userId: req.user.id
        };

        banlistService.addBanlistEntry(entry)
            .then(ip => {
                ip.user = req.user.username;

                res.send({ success: true, entry: ip });
            })
            .catch(() => {
                return res.send({ success: false, message: 'An error occured adding the banlist entry' });
            });
    }));
};
