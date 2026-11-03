const ConfigService = require('../services/ConfigService');
const WrappedEmailService = require('../services/WrappedEmailService');
const { wrapAsync } = require('../util.js');

let wrappedEmailService = new WrappedEmailService(new ConfigService());

module.exports.init = function (server) {
    // Used by the unsubscribe page, and by mail clients' one-click unsubscribe (RFC 8058), which POSTs to the
    // List-Unsubscribe address with the id and token in the query string. Not rate limited: the token can't be
    // guessed, and one-click requests from a mail provider all come from a few addresses.
    server.post(
        '/api/unsubscribe',
        wrapAsync(async function (req, res) {
            const id = req.query.id || req.body?.id;
            const token = req.query.token || req.body?.token;

            if (!(await wrappedEmailService.unsubscribe(id, token))) {
                return res
                    .status(400)
                    .send({ success: false, message: 'This unsubscribe link is not valid' });
            }

            res.send({ success: true });
        })
    );
};
