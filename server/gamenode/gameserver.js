const _ = require('underscore');
const socketio = require('socket.io');
const jwt = require('jsonwebtoken');
const Raven = require('raven');
const http = require('http');
const https = require('https');
const fs = require('fs');
const config = require('config');

const logger = require('../log.js');
const ZmqSocket = require('./zmqsocket.js');
const Game = require('../game/game.js');
const Socket = require('../socket.js');
const version = require('../../version.js');

if(config.sentryDsn) {
    Raven.config(config.sentryDsn, { release: version }).install();
}

class GameServer {
    constructor() {
        this.games = {};

        this.protocol = 'https';

        try {
            var privateKey = fs.readFileSync(config.gameNode.keyPath).toString();
            var certificate = fs.readFileSync(config.gameNode.certPath).toString();
        } catch(e) {
            this.protocol = 'http';
        }

        this.host = config.gameNode.host;

        this.zmqSocket = new ZmqSocket(this.host, this.protocol);
        this.zmqSocket.on('onStartGame', this.onStartGame.bind(this));
        this.zmqSocket.on('onSpectator', this.onSpectator.bind(this));
        this.zmqSocket.on('onGameSync', this.onGameSync.bind(this));
        this.zmqSocket.on('onFailedConnect', this.onFailedConnect.bind(this));
        this.zmqSocket.on('onCloseGame', this.onCloseGame.bind(this));

        var server = undefined;

        if(!privateKey || !certificate) {
            server = http.createServer();
        } else {
            server = https.createServer({ key: privateKey, cert: certificate });
        }

        server.listen(config.gameNode.socketioPort);

        var options = {
            perMessageDeflate: false
        };

        if(config.env !== 'production') {
            options.path = '/' + (config.gameNode.name) + '/socket.io';
        }

        this.io = socketio(server, options);
        this.io.set('heartbeat timeout', 30000);
        this.io.use(this.handshake.bind(this));

        if(config.env === 'production') {
            this.io.set('origins', 'http://www.jigoku.online:* https://www.jigoku.online:* ');
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
            gameCount: _.size(this.games)
        };
    }

    handleError(game, e) {
        logger.error(e);

        var debugData = {};

        debugData.game = game.getState();

        _.each(game.getPlayers(), player => {
            debugData[player.name] = player.getState(player);
        });

        Raven.captureException(e, { extra: debugData });

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
            if(player.left || player.disconnected || !player.socket) {
                return;
            }

            player.socket.send('gamestate', game.getState(player.name));
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
        this.zmqSocket.send('GAMEWIN', { game: game.getSaveState(), winner: winner.name, reason: reason });
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
            var retGame = game.getSummary();
            retGame.password = game.password;

            return retGame;
        });

        logger.info('syncing', _.size(gameSummaries), ' games');

        callback(gameSummaries);
    }

    onFailedConnect(gameId, username) {
        var game = this.findGameForUser(username);
        if(!game || game.id !== gameId) {
            return;
        }

        game.failedConnect(username);

        if(game.isEmpty()) {
            delete this.games[game.id];

            this.zmqSocket.send('GAMECLOSED', { game: game.id });
        }

        this.sendGameState(game);
    }

    onCloseGame(gameId) {
        var game = this.games[gameId];
        if(!game) {
            return;
        }

        delete this.games[gameId];
        this.zmqSocket.send('GAMECLOSED', { game: game.id });
    }

    onConnection(ioSocket) {
        if(!ioSocket.request.user) {
            logger.info('socket connected with no user, disconnecting');
            ioSocket.disconnect();
            return;
        }

        var game = this.findGameForUser(ioSocket.request.user.username);
        if(!game) {
            logger.info('No game for', ioSocket.request.user.username, 'disconnecting');
            ioSocket.disconnect();
            return;
        }

        var socket = new Socket(ioSocket, { config: config });

        var player = game.playersAndSpectators[socket.user.username];
        if(!player) {
            return;
        }

        player.lobbyId = player.id;
        player.id = socket.id;
        if(player.disconnected) {
            logger.info('user \'%s\' reconnected to game', socket.user.username);
            game.reconnect(socket, player.name);
        }

        socket.joinChannel(game.id);

        player.socket = socket;

        if(!game.isSpectator(player)) {
            game.addMessage('{0} has connected to the game server', player);
        }

        this.sendGameState(game);

        socket.registerEvent('game', this.onGameMessage.bind(this));
        socket.on('disconnect', this.onSocketDisconnected.bind(this));
    }

    onSocketDisconnected(socket, reason) {
        var game = this.findGameForUser(socket.user.username);
        if(!game) {
            return;
        }

        logger.info('user \'%s\' disconnected from a game: %s', socket.user.username, reason);

        var isSpectator = game.isSpectator(game.playersAndSpectators[socket.user.username]);

        game.disconnect(socket.user.username);

        if(game.isEmpty()) {
            delete this.games[game.id];

            this.zmqSocket.send('GAMECLOSED', { game: game.id });
        } else if(isSpectator) {
            this.zmqSocket.send('PLAYERLEFT', { gameId: game.id, game: game.getSaveState(), player: socket.user.username, spectator: true });
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

        this.zmqSocket.send('PLAYERLEFT', {
            gameId: game.id,
            game: game.getSaveState(),
            player: socket.user.username,
            spectator: isSpectator
        });

        socket.send('cleargamestate');
        socket.leaveChannel(game.id);

        if(game.isEmpty()) {
            delete this.games[game.id];

            this.zmqSocket.send('GAMECLOSED', { game: game.id });
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
