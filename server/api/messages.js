const passport = require('passport');

const ServiceFactory = require('../services/ServiceFactory.js');

const logger = require('../log.js');

let messageService = ServiceFactory.messageService();

module.exports.init = function (server) {
    server.delete(
        '/api/messages/:messageId',
        passport.authenticate('jwt', { session: false }),
        function (req, res) {
            if (!req.user.permissions || !req.user.permissions.canModerateChat) {
                return res.status(403);
            }

            messageService
                .removeMessage(req.params.messageId, req.user)
                .then(() => {
                    res.send({ success: true });
                })
                .catch((err) => {
                    logger.error(err);
                    res.send({ success: false, message: 'An error occured deleting the message' });
                });
        }
    );
};
