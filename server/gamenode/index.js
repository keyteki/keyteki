const pmx = require('pmx');

const GameServer = require('./gameserver.js');

var server = new GameServer();

pmx.action('debug', (reply) => {
    reply(server.debugDump());
});
