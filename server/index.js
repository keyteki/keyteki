const Server = require('./server');
const Lobby = require('./lobby');
const UserService = require('./services/UserService');
const ConfigService = require('./services/ConfigService');
const configService = new ConfigService();

async function runServer() {
    const options = { configService: configService };

    options.userService = new UserService(options.configService);

    const server = new Server(process.env.NODE_ENV !== 'production');
    const httpServer = await server.init(options);
    const lobby = new Lobby(httpServer, options);

    await lobby.init();

    server.run();
}

module.exports = runServer;
