const _ = require('underscore');
const socketio = require('socket.io');
const jwt = require('jsonwebtoken');
const raven = require('raven');

const config = require('./nodeconfig.js');
const logger = require('../log.js');
const ZmqSocket = require('./zmqsocket.js');
const Game = require('../game/game.js');
const Socket = require('../socket.js');
const http = require('http');
const https = require('https');
const fs = require('fs');

var ravenClient = new raven.Client(config.sentryDsn);
ravenClient.patchGlobal();

class GameServer {
    constructor() {
        this.games = {};
        this.sockets = {};

        this.protocol = 'https';

        try {
            var privateKey = fs.readFileSync(config.keyPath).toString();
            var certificate = fs.readFileSync(config.certPath).toString();
        } catch(e) {
            this.protocol = 'http';
        }

        this.host = config.host || process.env.HOST;

        this.socket = new ZmqSocket(this.host, this.protocol);
        this.socket.on('onStartGame', this.onStartGame.bind(this));
        this.socket.on('onSpectator', this.onSpectator.bind(this));
        this.socket.on('onGameSync', this.onGameSync.bind(this));

        var server = undefined;

        if(!privateKey || !certificate) {
            server = http.createServer();
        } else {
            server = https.createServer({ key: privateKey, cert: certificate });
        }

        server.listen(process.env.PORT || config.socketioPort);

        this.io = socketio(server);
        this.io.set('heartbeat timeout', 30000);
        this.io.use(this.handshake.bind(this));
        if(process.env.NODE_ENV === 'production') {
            this.io.set('origins', 'http://www.throneteki.net:* https://www.throneteki.net:* http://www.theironthrone.net:* https://www.theironthrone.net:*');
        }

        this.io.on('connection', this.onConnection.bind(this));
    }

    debugDump() {
        var games = _.map(this.games, game => {
            var players = _.map(game.playersAndSpectators, player => {
                return {
                    name: player.name,
                    left: player.left,
                    disconnected: player.disconnected,
                    id: player.id,
                    spectator: game.isSpectator(player)
                };
            });

            return {
                name: game.name,
                players: players,
                id: game.id,
                started: game.started,
                startedAt: game.startedAt
            };
        });

        return {
            games: games,
            socketCount: _.size(this.sockets),
            gameCount: _.size(this.games)
        };
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
            var player = game.playersAndSpectators[username];

            if(!player || player.left) {
                return false;
            }

            return true;
        });
    }

    sendGameState(game) {
        _.each(game.getPlayersAndSpectators(), player => {
            if(player.left) {
                return;
            }

            if(this.sockets[player.id]) {
                this.sockets[player.id].send('gamestate', game.getState(player.name));
            }
        });
    }

    handshake(socket, next) {
        if(socket.handshake.query.token && socket.handshake.query.token !== 'undefined') {
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

    onStartGame(pendingGame) {
        var game = new Game(pendingGame, { router: this });
        this.games[pendingGame.id] = game;

        game.started = true;
        _.each(pendingGame.players, player => {
            game.selectDeck(player.name, player.deck);
        });

        game.initialise();
    }

    onSpectator(pendingGame, user) {
        var game = this.games[pendingGame.id];
        if(!game) {
            return;
        }

        game.watch('TBA', user);

        this.sendGameState(game);
    }

    onGameSync(callback) {
        var gameSummaries = _.map(this.games, game => {
            return game.getSummary();
        });

        callback(gameSummaries);
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

        var socket = new Socket(ioSocket, { config: config, ravenClient: ravenClient });

        var player = game.playersAndSpectators[socket.user.username];
        if(!player) {
            return;
        }

        player.lobbyId = player.id;
        player.id = socket.id;
        if(player.disconnected) {
            game.reconnect(socket.id, player.name);
        }

        socket.joinChannel(game.id);

        this.sockets[socket.id] = socket;

        if(!game.isSpectator(player)) {
            game.addMessage('{0} has connected to the game server', player);
        }

        this.sendGameState(game);

        socket.registerEvent('game', this.onGameMessage.bind(this));
        socket.on('disconnect', this.onSocketDisconnected.bind(this));
    }

    onSocketDisconnected(socket) {
        delete this.sockets[socket.id];

        var game = this.findGameForUser(socket.user.username);
        if(!game) {
            return;
        }

        var isSpectator = game.isSpectator(game.playersAndSpectators[socket.user.username]);

        game.disconnect(socket.user.username);

        if(game.isEmpty()) {
            delete this.games[game.id];

            this.socket.send('GAMECLOSED', { game: game.id });
        } else if(isSpectator) {
            this.socket.send('PLAYERLEFT', { gameId: game.id, game: game.getSaveState(), player: socket.user.username, spectator: true });
        }

        this.sendGameState(game);
    }

    onLeaveGame(socket) {
        var game = this.findGameForUser(socket.user.username);
        if(!game) {
            return;
        }

        var isSpectator = game.isSpectator(game.playersAndSpectators[socket.user.username]);

        game.leave(socket.user.username);

        this.socket.send('PLAYERLEFT', {
            gameId: game.id,
            game: game.getSaveState(),
            player: socket.user.username,
            spectator: isSpectator
        });

        socket.send('gamestate', game.getState(socket.user.username));

        socket.leaveChannel(game.id);

        delete this.sockets[socket.id];

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

        this.runAndCatchErrors(game, () => {
            game[command](socket.user.username, ...args);

            game.continue();

            this.sendGameState(game);
        });
    }
}

module.exports = GameServer;
