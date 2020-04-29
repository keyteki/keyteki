const _ = require('underscore');
const socketio = require('socket.io');
const jwt = require('jsonwebtoken');
const Sentry = require('@sentry/node');
const http = require('http');
const https = require('https');
const fs = require('fs');
const config = require('config');

const { detectBinary } = require('../util');
const logger = require('../log.js');
const ZmqSocket = require('./zmqsocket.js');
const Game = require('../game/game.js');
const Socket = require('../socket.js');
const version = require('../../version.js');

if(config.sentryDsn) {
    Sentry.init({ dsn: config.sentryDsn, release: version.build });
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

        this.zmqSocket = new ZmqSocket(this.host, this.protocol, version.build);
        this.zmqSocket.on('onStartGame', this.onStartGame.bind(this));
        this.zmqSocket.on('onSpectator', this.onSpectator.bind(this));
        this.zmqSocket.on('onGameSync', this.onGameSync.bind(this));
        this.zmqSocket.on('onFailedConnect', this.onFailedConnect.bind(this));
        this.zmqSocket.on('onCloseGame', this.onCloseGame.bind(this));
        this.zmqSocket.on('onCardData', this.onCardData.bind(this));

        var server = undefined;

        if(!privateKey || !certificate) {
            server = http.createServer();
        } else {
            server = https.createServer({ key: privateKey, cert: certificate });
        }

        server.listen(process.env.PORT || config.gameNode.socketioPort, '0.0.0.0');

        var options = {
            perMessageDeflate: false
        };

        if(process.env.NODE_ENV !== 'production') {
            options.path = '/' + (process.env.SERVER || config.gameNode.name) + '/socket.io';
        }

        logger.info(`Listening on 0.0.0.0:${process.env.PORT || config.gameNode.socketioPort}/${(process.env.SERVER || config.gameNode.name)}/socket.io`);

        this.io = socketio(server, options);
        this.io.set('heartbeat timeout', 30000);
        this.io.use(this.handshake.bind(this));

        if(config.gameNode.origin) {
            this.io.set('origins', config.gameNode.origin);
        }

        this.io.on('connection', this.onConnection.bind(this));

        setInterval(() => this.clearStaleAndFinishedGames(), 30 * 1000);
    }

    debugDump() {
        var games = _.map(this.games, game => {
            var players = _.map(game.playersAndSpectators, player => {
                return {
                    name: player.name,
                    left: player.left,
                    disconnected: !!player.disconnectedAt,
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

        let gameState = game.getState();
        let debugData = {};

        if(e.message.includes('Maximum call stack')) {
            debugData.badSerializaton = detectBinary(gameState);
        } else {
            debugData.game = gameState;
            debugData.game.players = undefined;

            debugData.messages = game.getPlainTextLog();
            debugData.game.messages = undefined;

            _.each(game.getPlayers(), player => {
                debugData[player.name] = player.getState(player);
            });
        }

        Sentry.configureScope((scope) => {
            scope.setExtra('extra', debugData);
        });
        Sentry.captureException(e);
        if(game) {
            game.addMessage(
                'A Server error has occured processing your game state, apologies.  Your game may now be in an inconsistent state, or you may be able to continue.  The error has been logged.');
        }
    }

    closeGame(game) {
        for(let player of Object.values(game.getPlayersAndSpectators())) {
            if(player.socket) {
                player.socket.tIsClosing = true;
                player.socket.disconnect();
            }
        }

        delete this.games[game.id];
        this.zmqSocket.send('GAMECLOSED', { game: game.id });
    }

    clearStaleAndFinishedGames() {
        const timeout = 20 * 60 * 1000;

        let staleGames = Object.values(this.games).filter(game => game.finishedAt && (Date.now() - game.finishedAt > timeout));
        for(let game of staleGames) {
            logger.info(`closed finished game ${game.id} due to inactivity`);
            this.closeGame(game);
        }

        let emptyGames = Object.values(this.games).filter(game => game.isEmpty());
        for(let game of emptyGames) {
            logger.info(`closed empty game ${game.id}`);
            this.closeGame(game);
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
            if(player.left || player.disconnectedAt || !player.socket) {
                return;
            }

            player.socket.send('gamestate', game.getState(player.name));
        });
    }

    handshake(socket, next) {
        if(socket.handshake.query.token && socket.handshake.query.token !== 'undefined') {
            jwt.verify(socket.handshake.query.token, config.secret, function(err, user) {
                if(err) {
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

    rematch(game) {
        this.zmqSocket.send('REMATCH', { game: game.getSaveState() });

        for(let player of Object.values(game.getPlayersAndSpectators())) {
            if(player.left || player.disconnectedAt || !player.socket) {
                continue;
            }

            player.socket.send('cleargamestate');
            player.socket.leaveChannel(game.id);
            player.left = true; // So they don't get game state sent after the /rematch command is issued
        }

        delete this.games[game.id];
    }

    onStartGame(pendingGame) {
        let game = new Game(pendingGame, { router: this, cardData: this.cardData });
        game.on('onTimeExpired', () => {
            this.sendGameState(game);
        });
        this.games[pendingGame.id] = game;

        game.started = true;
        for(let player of Object.values(pendingGame.players)) {
            let playerName = player.name;
            game.setWins(playerName, player.wins);
            if((pendingGame.gameFormat === 'reversal' || pendingGame.swap) && !(pendingGame.gameFormat === 'reversal' && pendingGame.swap)) {
                let otherPlayer = game.getOtherPlayer(player);
                if(otherPlayer) {
                    playerName = otherPlayer.name;
                }
            }

            game.selectDeck(playerName, player.deck);
        }

        game.initialise();
        if(pendingGame.rematch) {
            game.addAlert('info', 'The rematch is ready');
        }
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
            var retGame = game.getSummary(undefined, { fullData: true });
            retGame.password = game.password;

            return retGame;
        });

        logger.info(`syncing ${_.size(gameSummaries)} games`);

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
        let game = this.games[gameId];
        if(!game) {
            return;
        }

        for(let player of Object.values(game.getPlayersAndSpectators())) {
            player.socket.send('cleargamestate');
            player.socket.leaveChannel(game.id);
        }

        delete this.games[gameId];
        this.zmqSocket.send('GAMECLOSED', { game: game.id });
    }

    onCardData(cardData) {
        this.cardData = cardData.cardData;
    }

    onConnection(ioSocket) {
        if(!ioSocket.request.user) {
            logger.info('socket connected with no user, disconnecting');
            ioSocket.disconnect();
            return;
        }

        let game = this.findGameForUser(ioSocket.request.user.username);
        if(!game) {
            logger.info(`No game for ${ioSocket.request.user.username} disconnecting`);
            ioSocket.disconnect();
            return;
        }

        let socket = new Socket(ioSocket, { config: config });

        let player = game.playersAndSpectators[socket.user.username];
        if(!player) {
            return;
        }

        player.lobbyId = player.id;
        player.id = socket.id;
        player.connectionSucceeded = true;

        if(player.disconnectedAt) {
            logger.info(`user '${socket.user.username} reconnected to game`);
            game.reconnect(socket, player.name);
        }

        socket.joinChannel(game.id);

        player.socket = socket;

        if(!game.isSpectator(player) && !player.disconnectedAt) {
            game.addAlert('info', '{0} has connected to the game server', player);
        }

        this.sendGameState(game);

        socket.registerEvent('game', this.onGameMessage.bind(this));
        socket.on('disconnect', this.onSocketDisconnected.bind(this));
    }

    onSocketDisconnected(socket, reason) {
        let game = this.findGameForUser(socket.user.username);
        if(!game) {
            return;
        }

        logger.info(`user '${socket.user.username}' disconnected from a game: ${reason}`);

        let player = game.playersAndSpectators[socket.user.username];
        if(player.id !== socket.id) {
            return;
        }

        let isSpectator = player && player.isSpectator();

        game.disconnect(socket.user.username);

        if(!socket.tIsClosing) {
            if(game.isEmpty()) {
                delete this.games[game.id];

                this.zmqSocket.send('GAMECLOSED', { game: game.id });
            } else if(isSpectator) {
                this.zmqSocket.send('PLAYERLEFT', { gameId: game.id, game: game.getSaveState(), player: socket.user.username, spectator: true });
            }
        }

        this.sendGameState(game);
    }

    onLeaveGame(socket) {
        let game = this.findGameForUser(socket.user.username);
        if(!game) {
            return;
        }

        let player = game.playersAndSpectators[socket.user.username];
        let isSpectator = player.isSpectator();

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
        let game = this.findGameForUser(socket.user.username);

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
