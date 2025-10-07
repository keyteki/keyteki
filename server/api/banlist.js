import passport from 'passport';
import BanlistService from '../services/BanlistService.js';
import { wrapAsync } from '../util.js';

let banlistService = new BanlistService();

export function init(server) {
    server.get(
        '/api/banlist',
        passport.authenticate('jwt', { session: false }),
        wrapAsync(async function (req, res) {
            if (!req.user.permissions || !req.user.permissions.canManageBanlist) {
                return res.status(403);
            }

            let banlist = await banlistService.getBanList();

            return res.send({ success: true, banlist: banlist });
        })
    );

    server.post(
        '/api/banlist',
        passport.authenticate('jwt', { session: false }),
        wrapAsync(async function (req, res) {
            if (!req.user.permissions || !req.user.permissions.canManageBanlist) {
                return res.status(403);
            }

            let entry = await banlistService.getEntryByIp(req.body.ip);
            if (entry) {
                return res.status(400).send({ success: false, message: 'Already exists' });
            }

            // @ts-ignore partial entry, service will complete fields
            entry = {
                ip: req.body.ip,
                userId: req.user.id
            };

            banlistService
                .addBanlistEntry(entry)
                .then((ip) => {
                    ip.user = req.user.username;

                    res.send({ success: true, entry: ip });
                })
                .catch(() => {
                    return res.send({
                        success: false,
                        message: 'An error occured adding the banlist entry'
                    });
                });
        })
    );
}
