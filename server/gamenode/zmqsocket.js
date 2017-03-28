const EventEmitter = require('events');
const zmq = require('zmq');
const config = require('./nodeconfig.js');
const logger = require('../log.js');

class ZmqSocket extends EventEmitter {
    constructor(listenAddress, protocol) {
        super();

        this.listenAddress = listenAddress;
        this.protocol = protocol;

        this.socket = zmq.socket('dealer');
        this.socket.identity = process.env.SERVER || config.nodeIdentity;
        this.socket.monitor(500, 0);

        this.socket.connect(config.mqUrl, err => {
            if(err) {
                logger.info(err);
            }
        });

        this.socket.on('connect', this.onConnect.bind(this));
        this.socket.on('message', this.onMessage.bind(this));
    }

    send(command, arg) {
        this.socket.send(JSON.stringify({ command: command, arg: arg }));
    }

    onConnect() {
        this.emit('onGameSync', this.onGameSync.bind(this));
    }

    onGameSync(games) {
        this.send('HELLO', {
            maxGames: config.maxGames,
            address: this.listenAddress,
            port: process.env.PORT || config.socketioPort,
            protocol: this.protocol,
            games: games });
    }

    onMessage(x, msg) {
        var message = undefined;

        try {
            message = JSON.parse(msg.toString());
        } catch(err) {
            logger.info(err);
            return;
        }

        switch(message.command) {
            case 'PING':
                this.send('PONG');

                break;
            case 'STARTGAME':
                this.emit('onStartGame', message.arg);

                break;
            case 'SPECTATOR':
                this.emit('onSpectator', message.arg.game, message.arg.user);

                break;
            case 'CONNECTFAILED':
                this.emit('onFailedConnect', message.arg.gameId, message.arg.username);
                break;
        }
    }
}

module.exports = ZmqSocket;
