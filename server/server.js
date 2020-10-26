const ConfigService = require('./services/ConfigService');
const logger = require('./log.js');

const http = require('http');
const Sentry = require('@sentry/node');

const version = require('../version.js');

class Server {
    constructor(isDeveloping) {
        this.configService = new ConfigService();

        this.isDeveloping = isDeveloping;
        this.server = http.createServer();
    }

    init() {
        if (!this.isDeveloping) {
            Sentry.init({ dsn: this.configService.getValue('sentryDsn'), release: version.build });
        }

        return this.server;
    }

    run() {
        let port =
            process.env.PORT || this.configService.getValueForSection('lobby', 'port') || 4000;

        this.server.listen(port, '0.0.0.0', function onStart(err) {
            if (err) {
                logger.error(err);
            }

            logger.info(
                `==> ?? Listening on port ${port}. Open up http://0.0.0.0:${port}/ in your browser.`
            );
        });
    }
}

module.exports = Server;
