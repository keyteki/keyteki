const os = require('os');
const interfaces = os.networkInterfaces();
const _ = require('underscore');
const socketio = require('socket.io');
const jwt = require('jsonwebtoken');
const raven = require('raven');

const config = require('./nodeconfig.js');
const logger = require('../log.js');
const ZmqSocket = require('./zmqsocket.js');
const Game = require('../game/game.js');
const Socket = require('../socket.js');

var ravenClient = new raven.Client(config.sentryDsn);
ravenClient.patchGlobal();

class GameServer {
    constructor() {
        this.listenAddress = this.getNetworkAddress();
        this.games = {};
        this.sockets = {};

        this.socket = new ZmqSocket(this.listenAddress);
        this.socket.on('onStartGame', this.onStartGame.bind(this));
        this.socket.on('onSpectator', this.onSpectator.bind(this));

        this.io = socketio();
        this.io.listen(process.env.PORT || config.socketioPort);
        this.io.set('heartbeat timeout', 30000);
        this.io.use(this.handshake.bind(this));
        this.io.on('connection', this.onConnection.bind(this));
    }

    getNetworkAddress() {
        var firstAddress = undefined;

        _.each(interfaces, addresses => {
            _.each(addresses, address => {
                if(address.family !== 'IPv4' || address.internal || firstAddress) {
                    return;
                }

                firstAddress = address.address;
            });
        });

        return firstAddress;
    }

    handleError(game, e) {
        logger.error(e);

        var debugData = {};

        debugData.game = game.getState();

        _.each(game.getPlayers(), player => {
            debugData[player.name] = player.getState(player.name);
        });

        ravenClient.captureException(e, { extra: debugData });

        if(game) {
            game.addMessage('A Server error has occured processing your game state, apologies.  Your game may now be in an inconsistent state, or you may be able to continue.  The error has been logged.');
        }
    }

    runAndCatchErrors(game, func) {
        try {
            func();
        } catch(e) {
            this.handleError(game, e);

            this.sendGameState(game);
        }
    }


    findGameForUser(username) {
        return _.find(this.games, game => {
            return game.playersAndSpectators[username];
        });
    }

    sendGameState(game) {
        _.each(game.getPlayersAndSpectators(), player => {
            if(this.sockets[player.id]) {
                this.sockets[player.id].send('gamestate', game.getState(player.name));
            }
        });
    }

    handshake(socket, next) {
        if(socket.handshake.query.token) {
            jwt.verify(socket.handshake.query.token, config.secret, function(err, user) {
                if(err) {
                    logger.info(err);
                    return;
                }

                socket.request.user = user;
            });
        }

        next();
    }

    gameWon(game, reason, winner) {
        this.socket.send('GAMEWIN', { game: game.getSaveState(), winner: winner.name, reason: reason });
    }

    playerLeft(game, player) {
        this.socket.send('PLAYERLEFT', { game: game.getSaveState(), player: player.name });
    }

    onStartGame(pendingGame) {
        var game = new Game(pendingGame, { router: this });
        this.games[pendingGame.id] = game;

        game.started = true;
        _.each(pendingGame.players, player => {
            game.selectDeck(player.name, player.deck);
        });

        game.initialise();

        logger.info('Starting new game', game.id);
    }

    onSpectator(pendingGame, username) {
        var game = this.games[pendingGame.id];
        if(!game) {
            return;
        }

        game.watch('TBA', { username: username });

        this.sendGameState(game);
    }

    onConnection(ioSocket) {
        if(!ioSocket.request.user) {
            ioSocket.disconnect();
            return;
        }

        var game = this.findGameForUser(ioSocket.request.user.username);
        if(!game) {
            ioSocket.disconnect();
            return;
        }

        var socket = new Socket(ioSocket);

        var player = game.playersAndSpectators[socket.user.username];
        if(!player) {
            return;
        }

        player.id = socket.id;
        if(player.disconnected) {
            game.reconnect(socket.id, player.name);
        }

        socket.joinChannel(game.id);

        this.sockets[socket.id] = socket;

        this.sendGameState(game);

        socket.registerEvent('game', this.onGameMessage.bind(this));
        socket.on('disconnect', this.onSocketDisconnected.bind(this));

        this.sockets[ioSocket.id] = socket;
    }

    onSocketDisconnected(socket) {
        var game = this.findGameForUser(socket.user.username);
        if(!game) {
            return;
        }

        game.disconnect(socket.user.username);

        if(game.isEmpty()) {
            delete this.games[game.id];

            this.socket.send('GAMECLOSED', { game: game.id });
        }

        this.sendGameState(game);
    }

    onLeaveGame(socket) {
        var game = this.findGameForUser(socket.user.username);
        if(!game) {
            return;
        }

        game.leave(socket.user.username);
        socket.leaveChannel(game.id);

        if(game.isEmpty()) {
            delete this.games[game.id];

            this.socket.send('GAMECLOSED', { game: game.id });
        }

        this.sendGameState(game);
    }

    onGameMessage(socket, command, ...args) {
        var game = this.findGameForUser(socket.user.username);

        if(!game) {
            return;
        }

        if(command === 'leavegame') {
            return this.onLeaveGame(socket);
        }

        if(!game[command] || !_.isFunction(game[command])) {
            return;
        }

        this.runAndCatchErrors(() => {
            game[command](socket.user.username, ...args);

            game.continue();

            this.sendGameState(game);
        });
    }
}

module.exports = GameServer;
