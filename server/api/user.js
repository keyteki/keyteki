const monk = require('monk');
const UserService = require('../services/UserService.js');
const logger = require('../log.js');
const config = require('config');

let db = monk(config.dbPath);
let userService = new UserService(db);

module.exports.init = function(server) {
    server.get('/api/user/:username', function(req, res) {
        if(!req.user) {
            return res.status(401);
        }

        if(!req.user.permissions || !req.user.permissions.canManageUsers) {
            return res.status(403);
        }

        userService.getUserByUsername(req.params.username)
            .then(user => {
                if(!user) {
                    res.status(404).send({ message: 'Not found'});

                    return Promise.reject('User not found');
                }

                res.send({ success: true, user: user });
            })
            .catch(err => {
                logger.error(err);
            });
    });

    server.put('/api/user/:username', function(req, res) {
        if(!req.user) {
            return res.status(401);
        }

        if(!req.user.permissions || !req.user.permissions.canManageUsers) {
            return res.status(403);
        }

        let userToSet = JSON.parse(req.body.data);

        userService.getUserByUsername(req.params.username)
            .then(user => {
                if(!user) {
                    return res.status(404).send({ message: 'Not found'});
                }

                user.permissions = userToSet.permissions;

                return userService.update(user);
            })
            .then(() => {
                res.send({ success: true });
            })
            .catch(() => {
                return res.send({ success: false, message: 'An error occured saving the user' });
            });
    });
};
