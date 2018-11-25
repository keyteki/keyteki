const monk = require('monk');
const passport = require('passport');

const UserService = require('../services/UserService.js');
const ConfigService = require('../services/ConfigService.js');
const { wrapAsync } = require('../util.js');
const logger = require('../log.js');

let configService = new ConfigService();

let db = monk(configService.getValue('dbPath'));
let userService = new UserService(db, configService);

module.exports.init = function(server) {
    server.get('/api/user/:username', passport.authenticate('jwt', { session: false }), wrapAsync(async (req, res) => {
        if(!req.user.permissions || !req.user.permissions.canManageUsers) {
            return res.status(403);
        }

        let user;
        try {
            user = await userService.getUserByUsername(req.params.username);
        } catch(error) {
            logger.error(error);

            return res.send({success: false, message: 'An error occurred searching the user.  Please try again later.'});
        }

        if(!user) {
            return res.status(404).send({ message: 'Not found' });
        }

        res.send({ success: true, user: user.getDetails() });
    }));

    server.put('/api/user/:username', passport.authenticate('jwt', { session: false }), wrapAsync(async (req, res) => {
        if(!req.user.permissions || !req.user.permissions.canManageUsers) {
            return res.status(403);
        }

        if(!req.body.userToChange) {
            return res.send({ success: false, message: 'You must specify the user data' });
        }

        let userToSet = req.body.userToChange;
        let dbUser;

        try {
            dbUser = await userService.getUserByUsername(req.params.username);
        } catch(error) {
            logger.error(error);

            return res.send({ success: false, message: 'An error occured saving the user.  Please try again later.' });
        }

        let user = dbUser.getDetails();

        if(!user) {
            return res.status(404).send({ message: 'Not found'});
        }

        if(req.user.permissions.canManagePermissions) {
            user.permissions = userToSet.permissions;
        }

        user.verified = userToSet.verified;
        user.disabled = userToSet.disabled;

        try {
            await userService.update(user);
        } catch(error) {
            logger.error(error);

            return res.send({ success: false, message: 'An error occured saving the user.  Please try again later.' });
        }

        res.send({ success: true });
    }));
};
