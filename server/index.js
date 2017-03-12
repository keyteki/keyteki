const Server = require('./server.js');
const Lobby = require('./lobby.js');
const pmx = require('pmx');

function runServer() {
    var server = new Server(process.env.NODE_ENV !== 'production');
    var httpServer = server.init();
    var lobby = new Lobby(httpServer);

    pmx.action('status', reply => {
        var status = lobby.getStatus();

        reply(status);
    });

    pmx.action('disable', (param, reply) => {
        if(!param) {
            reply({error: 'Need to specify node to disable'});

            return;
        }

        reply({ success: lobby.disableNode(param) });
    });

    pmx.action('enable', (param, reply) => {
        if(!param) {
            reply({error: 'Need to specify node to enable'});

            return;
        }

        reply({ success: lobby.enableNode(param) });
    });

    server.run();
}

module.exports = runServer;
