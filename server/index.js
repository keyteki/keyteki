const pmx = require('pmx');

const Server = require('./server');
const Lobby = require('./lobby');
const ConfigService = require('./services/ConfigService');
const configService = new ConfigService();

async function runServer() {
    let options = { configService: configService };

    let server = new Server(process.env.NODE_ENV !== 'production');
    let httpServer = server.init();
    let lobby = new Lobby(httpServer, options);

    await lobby.init();

    pmx.action('status', (reply) => {
        var status = lobby.getStatus();

        reply(status);
    });

    pmx.action('disable', (param, reply) => {
        if (!param) {
            reply({ error: 'Need to specify node to disable' });

            return;
        }

        reply({ success: lobby.disableNode(param) });
    });

    pmx.action('enable', (param, reply) => {
        if (!param) {
            reply({ error: 'Need to specify node to enable' });

            return;
        }

        reply({ success: lobby.enableNode(param) });
    });

    pmx.action('debug', (reply) => {
        reply(lobby.debugDump());
    });

    server.run();
}

module.exports = runServer;
