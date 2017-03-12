const zmq = require('zmq');
const router = zmq.socket('router');
const logger = require('./log.js');
const config = require('./config.js');
const _ = require('underscore');
const EventEmitter = require('events');
const GameRepository = require('./repositories/gameRepository.js');

class GameRouter extends EventEmitter {
    constructor() {
        super();

        this.workers = {};
        this.gameRepository = new GameRepository();

        router.bind(config.mqUrl, err => {
            if(err) {
                logger.info(err);
            }
        });

        router.on('message', this.onMessage.bind(this));

        setInterval(this.checkTimeouts.bind(this), 100);
    }

    // External methods
    startGame(game) {
        var node = this.getNextAvailableGameNode();

        if(!node) {
            logger.error('Could not find new node for game');
            return;
        }

        this.gameRepository.save(game.getSaveState(), (err, id) => {
            if(!err) {
                game.savedGameId = id;
            }
        });

        node.numGames++;

        this.sendCommand(node.identity, 'STARTGAME', game);
        return node;
    }

    addSpectator(game, username) {
        this.sendCommand(game.node.identity, 'SPECTATOR', { game: game, username: username });
    }

    getNextAvailableGameNode() {
        if(_.isEmpty(this.workers)) {
            return undefined;
        }

        var returnedWorker = undefined;

        _.each(this.workers, worker => {
            if(worker.numGames >= worker.maxGames || worker.disabled) {
                return;
            }

            if(!returnedWorker || returnedWorker.numGames > worker.numGames) {
                returnedWorker = worker;
            }
        });

        return returnedWorker;
    }

    getNodeStatus() {
        return _.map(this.workers, worker => {
            return { name: worker.identity, numGames: worker.numGames, status: worker.disabled ? 'disabled' : 'active' };
        });
    }

    disableNode(nodeName) {
        var worker = this.workers[nodeName];
        if(!worker) {
            return false;
        }

        worker.disabled = true;

        return true;
    }

    enableNode(nodeName) {
        var worker = this.workers[nodeName];
        if(!worker) {
            return false;
        }

        worker.disabled = false;

        return true;
    }

    // Events
    onMessage(identity, msg) {
        var identityStr = identity.toString();

        var worker = this.workers[identityStr];

        var message = JSON.parse(msg.toString());
        switch(message.command) {
            case 'HELLO':
                this.workers[identityStr] = {
                    identity: identityStr,
                    maxGames: message.arg.maxGames,
                    numGames: 0,
                    address: message.arg.address,
                    port: message.arg.port
                };
                worker = this.workers[identityStr];
                break;
            case 'PONG':
                worker.pingSent = undefined;
                break;
            case 'GAMEWIN':
                this.gameRepository.save(message.arg, () => {});
                break;
            case 'GAMECLOSED':
                logger.info('game closed', message.arg.game);
                worker.numGames--;
                this.emit('onGameClosed', message.arg.game);

                break;
            case 'PLAYERLEFT':
                logger.info('player left', message.arg.gameId);

                if(!message.arg.spectator) {
                    this.gameRepository.save(message.arg.game);
                }

                this.emit('onPlayerLeft', message.arg.gameId, message.arg.player);

                break;
        }

        worker.lastMessage = Date.now();
    }

    // Internal methods
    sendCommand(identity, command, arg) {
        router.send([identity, '', JSON.stringify({ command: command, arg: arg })]);
    }

    checkTimeouts() {
        var currentTime = Date.now();

        _.each(this.workers, worker => {
            if(worker.pingSent && currentTime - worker.pingSent > 5 * 60 * 1000) {
                logger.info('worker', worker.identity + ' timed out');
                delete this.workers[worker.identity];
            } else if(!worker.pingSent) {
                if(currentTime - worker.lastMessage > 5 * 60 * 1000) {
                    worker.pingSent = currentTime;
                    this.sendCommand(worker.identity, 'PING');
                }
            }
        });
    }
}

module.exports = GameRouter;
