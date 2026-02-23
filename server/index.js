import Server from './server.js';
import Lobby from './lobby.js';
import UserService from './services/UserService.js';
import ConfigService from './services/ConfigService.js';
const configService = new ConfigService();

async function runServer() {
    let options = { configService: configService };

    options.userService = new UserService(options.configService);

    let server = new Server(process.env.NODE_ENV !== 'production');
    let httpServer = await server.init(options);
    let lobby = new Lobby(httpServer, options);

    await lobby.init();

    server.run();
}

export default runServer;
