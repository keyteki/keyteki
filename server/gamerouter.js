const zmq = require('zeromq');
const router = zmq.socket('router');
const logger = require('./log.js');
const EventEmitter = require('events');
const GameService = require('./services/GameService.js');

class GameRouter extends EventEmitter {
    constructor(configService) {
        super();

        this.workers = {};
        this.gameService = new GameService();

        router.bind(`tcp://0.0.0.0:${configService.getValue('mqPort')}`, err => {
            if(err) {
                logger.info(err);
            }
        });

        router.on('message', this.onMessage.bind(this));

        setInterval(this.checkTimeouts.bind(this), 1000 * 60);
    }

    // External methods
    startGame(game) {
        let node = this.getNextAvailableGameNode();

        if(!node) {
            logger.error('Could not find new node for game');
            return;
        }

        this.gameService.create(game.getSaveState());

        node.numGames++;

        this.sendCommand(node.identity, 'STARTGAME', game.getStartGameDetails());

        return node;
    }

    addSpectator(game, user) {
        this.sendCommand(game.node.identity, 'SPECTATOR', { game: game, user: user });
    }

    getNextAvailableGameNode() {
        if(Object.values(this.workers).length === 0) {
            return undefined;
        }

        var returnedWorker = undefined;

        for(const worker of Object.values(this.workers)) {
            if(worker.numGames >= worker.maxGames || worker.disabled || worker.disconnected) {
                continue;
            }

            if(!returnedWorker || returnedWorker.numGames > worker.numGames) {
                returnedWorker = worker;
            }
        }

        return returnedWorker;
    }

    getNodeStatus() {
        return Object.values(this.workers).map(worker => {
            return {
                name: worker.identity,
                numGames: worker.numGames,
                status: worker.disconnceted ? 'disconnected' : worker.disabled ? 'disabled' : 'active',
                version: worker.version
            };
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

    toggleNode(nodeName) {
        let worker = this.workers[nodeName];
        if(!worker) {
            return false;
        }

        worker.disabled = !worker.disabled;

        return true;
    }

    restartNode(nodeName) {
        let worker = this.workers[nodeName];
        if(!worker) {
            return false;
        }

        this.sendCommand(nodeName, 'RESTART', {});

        return true;
    }

    notifyFailedConnect(game, username) {
        if(!game.node) {
            return;
        }

        this.sendCommand(game.node.identity, 'CONNECTFAILED', { gameId: game.id, username: username });
    }

    closeGame(game) {
        if(!game.node) {
            return;
        }

        this.sendCommand(game.node.identity, 'CLOSEGAME', { gameId: game.id });
    }

    // Events
    onMessage(identity, msg) {
        var identityStr = identity.toString();

        var worker = this.workers[identityStr];

        var message = undefined;

        try {
            message = JSON.parse(msg.toString());
        } catch(err) {
            logger.info(err);
            return;
        }

        if(worker && worker.disconnected) {
            logger.info(`Worker ${identityStr} came back`);
            worker.disconnected = false;
        }

        switch(message.command) {
            case 'HELLO':
                this.emit('onWorkerStarted', identityStr);
                if(this.workers[identityStr]) {
                    logger.info(`Worker ${identityStr} was already known, presume reconnected`);
                    this.workers[identityStr].disconnected = false;
                }

                this.workers[identityStr] = {
                    identity: identityStr,
                    maxGames: message.arg.maxGames,
                    numGames: 0,
                    address: message.arg.address,
                    port: message.arg.port,
                    protocol: message.arg.protocol,
                    version: message.arg.version
                };
                worker = this.workers[identityStr];

                this.emit('onNodeReconnected', identityStr, message.arg.games);

                worker.numGames = message.arg.games.length;

                break;
            case 'PONG':
                if(worker) {
                    worker.pingSent = undefined;
                } else {
                    logger.error('PONG received for unknown worker');
                }

                break;
            case 'GAMEWIN':
                this.gameService.update(message.arg.game);
                break;
            case 'REMATCH':
                this.gameService.update(message.arg.game);

                if(worker) {
                    worker.numGames--;
                } else {
                    logger.error(`Got close game for non existant worker ${identity}`);
                }

                this.emit('onGameRematch', message.arg.game);

                break;
            case 'GAMECLOSED':
                if(worker) {
                    worker.numGames--;
                } else {
                    logger.error(`Got close game for non existant worker ${identity}`);
                }

                this.emit('onGameClosed', message.arg.game);

                break;
            case 'PLAYERLEFT':
                if(!message.arg.spectator) {
                    this.gameService.update(message.arg.game);
                }

                this.emit('onPlayerLeft', message.arg.gameId, message.arg.player);

                break;
        }

        if(worker) {
            worker.lastMessage = Date.now();
        }
    }

    // Internal methods
    sendCommand(identity, command, arg) {
        router.send([identity, '', JSON.stringify({ command: command, arg: arg })]);
    }

    checkTimeouts() {
        var currentTime = Date.now();
        const pingTimeout = 1 * 60 * 1000;

        for(const worker of Object.values(this.workers)) {
            if(worker.disconnceted) {
                continue;
            }

            if(worker.pingSent && currentTime - worker.pingSent > pingTimeout) {
                logger.info(`worker ${worker.identity} timed out`);
                worker.disconnected = true;
                this.emit('onWorkerTimedOut', worker.identity);
            } else if(!worker.pingSent) {
                if(currentTime - worker.lastMessage > pingTimeout) {
                    worker.pingSent = currentTime;
                    this.sendCommand(worker.identity, 'PING');
                }
            }
        }
    }
}

module.exports = GameRouter;
