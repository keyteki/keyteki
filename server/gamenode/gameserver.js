const socketio = require('socket.io');
const jwt = require('jsonwebtoken');
const Sentry = require('@sentry/node');
const http = require('http');
const https = require('https');
const fs = require('fs');

const { detectBinary } = require('../util');
const logger = require('../log');
const GameSocket = require('./gamesocket');
const Game = require('../game/game');
const Socket = require('../socket');
const ConfigService = require('../services/ConfigService');
const version = require('../../version');

class GameServer {
    constructor() {
        this.configService = new ConfigService();
        const sentryDsn = this.configService.getValue('sentryDsn');

        if (sentryDsn) {
            Sentry.init({ dsn: sentryDsn, release: version.build });
        }

        this.games = {};

        this.protocol = 'https';

        try {
            var privateKey = fs
                .readFileSync(this.configService.getValueForSection('gameNode', 'keyPath'))
                .toString();
            var certificate = fs
                .readFileSync(this.configService.getValueForSection('gameNode', 'certPath'))
                .toString();
        } catch (e) {
            this.protocol = 'http';
        }

        this.host = this.configService.getValueForSection('gameNode', 'host');

        this.gameSocket = new GameSocket(
            this.configService,
            this.host,
            this.protocol,
            version.build
        );
        this.gameSocket.on('onStartGame', this.onStartGame.bind(this));
        this.gameSocket.on('onSpectator', this.onSpectator.bind(this));
        this.gameSocket.on('onGameSync', this.onGameSync.bind(this));
        this.gameSocket.on('onFailedConnect', this.onFailedConnect.bind(this));
        this.gameSocket.on('onCloseGame', this.onCloseGame.bind(this));
        this.gameSocket.on('onCardData', this.onCardData.bind(this));

        var server = undefined;

        if (!privateKey || !certificate) {
            server = http.createServer();
        } else {
            server = https.createServer({ key: privateKey, cert: certificate });
        }

        const nodeName = this.configService.getValueForSection('gameNode', 'name');
        const socketioPort = this.configService.getValueForSection('gameNode', 'socketioPort');

        server.listen(process.env.PORT || socketioPort, '0.0.0.0');

        let options = {
            perMessageDeflate: false,
            pingTimeout: 15000
        };

        const corsOrigin = this.configService.getValueForSection('gameNode', 'origin');
        if (corsOrigin) {
            options.origins = corsOrigin;
        }

        if (process.env.NODE_ENV !== 'production') {
            options.path = '/' + (process.env.SERVER || nodeName) + '/socket.io';
        }

        logger.info(
            `Listening on 0.0.0.0:${process.env.PORT || socketioPort}/${
                process.env.SERVER || nodeName
            }/socket.io`
        );

        this.io = socketio(server, options);
        this.io.use(this.handshake.bind(this));

        this.io.on('connection', this.onConnection.bind(this));

        setInterval(() => this.clearStaleAndFinishedGames(), 30 * 1000);
    }

    debugDump() {
        const games = Object.values(this.games).map((game) => {
            const players = Object.values(game.playersAndSpectators).map((player) => {
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
            gameCount: Object.values(this.games).length
        };
    }

    /**
     * @param {import("../game/game")} game
     * @param {Error} e
     */
    handleError(game, e) {
        logger.error(e);

        let gameState = game.getState();
        let debugData = {};

        if (e.message.includes('Maximum call stack')) {
            debugData.badSerializaton = detectBinary(gameState);
        } else {
            debugData.game = gameState;
            debugData.game.players = undefined;

            debugData.messages = game.getPlainTextLog();
            debugData.game.messages = undefined;

            for (const player of game.getPlayers()) {
                debugData[player.name] = player.getState(player, game.gameFormat);
            }
        }

        Sentry.configureScope((scope) => {
            scope.setExtra('extra', debugData);
        });
        Sentry.captureException(e);
        if (game) {
            game.addMessage(
                'A Server error has occured processing your game state, apologies.  Your game may now be in an inconsistent state, or you may be able to continue.  The error has been logged.'
            );
        }
    }

    /**
     * @param {import("../game/game")} game
     */
    closeGame(game) {
        for (const player of Object.values(game.getPlayersAndSpectators())) {
            if (player.socket) {
                player.socket.tIsClosing = true;
                player.socket.disconnect();
            }
        }

        delete this.games[game.id];
        this.gameSocket.send('GAMECLOSED', { game: game.id });
    }

    clearStaleAndFinishedGames() {
        const timeout = 20 * 60 * 1000;

        const staleGames = Object.values(this.games).filter(
            (game) => game.finishedAt && Date.now() - game.finishedAt > timeout
        );
        for (const game of staleGames) {
            logger.info(`closed finished game ${game.id} due to inactivity`);
            this.closeGame(game);
        }

        const emptyGames = Object.values(this.games).filter((game) => game.isEmpty());
        for (const game of emptyGames) {
            logger.info(`closed empty game ${game.id}`);
            this.closeGame(game);
        }
    }

    /**
     * @param {import("../game/game")} game
     * @param {{ (): void }} func
     */
    runAndCatchErrors(game, func) {
        try {
            func();
        } catch (e) {
            this.handleError(game, e);

            this.sendGameState(game);
        }
    }

    /**
     * @param {string} username
     */
    findGameForUser(username) {
        return Object.values(this.games).find((game) => {
            const player = game.playersAndSpectators[username];

            if (!player || player.left) {
                return false;
            }

            return true;
        });
    }

    /**
     * @param {import("../game/game")} game
     */
    sendGameState(game) {
        for (const player of Object.values(game.getPlayersAndSpectators())) {
            if (player.left || player.disconnectedAt || !player.socket) {
                continue;
            }

            player.socket.send('gamestate', game.getState(player.name));
        }
    }

    /**
     * @param {import("socket.io").Socket} socket
     * @param {() => void} next
     */
    handshake(socket, next) {
        if (socket.handshake.query.token && socket.handshake.query.token !== 'undefined') {
            jwt.verify(
                socket.handshake.query.token,
                this.configService.getValue('secret'),
                function (err, user) {
                    if (err) {
                        return;
                    }

                    socket.request.user = user;
                }
            );
        }

        next();
    }

    /**
     * @param {import("../game/game")} game
     * @param {string} reason
     * @param {import("../game/player")} winner
     */
    gameWon(game, reason, winner) {
        this.gameSocket.send('GAMEWIN', {
            game: game.getSaveState(),
            winner: winner.name,
            reason: reason
        });
    }

    /**
     * @param {import("../game/game")} game
     */
    rematch(game) {
        this.gameSocket.send('REMATCH', { game: game.getSaveState() });

        for (let player of Object.values(game.getPlayersAndSpectators())) {
            if (player.left || player.disconnectedAt || !player.socket) {
                continue;
            }

            player.socket.send('cleargamestate');
            player.socket.leaveChannel(game.id);
            player.left = true; // So they don't get game state sent after the /rematch command is issued
        }

        delete this.games[game.id];
    }

    /**
     * @param {import("../pendinggame")} pendingGame
     */
    onStartGame(pendingGame) {
        let game = new Game(pendingGame, { router: this, cardData: this.cardData });

        game.on('onTimeExpired', () => {
            this.sendGameState(game);
        });
        this.games[pendingGame.id] = game;

        game.started = true;
        for (let player of Object.values(pendingGame.players)) {
            let playerName = player.name;
            game.setWins(playerName, player.wins);

            if (
                (pendingGame.gameFormat === 'reversal' || pendingGame.swap) &&
                !(pendingGame.gameFormat === 'reversal' && pendingGame.swap)
            ) {
                let otherPlayer = game.getOtherPlayer(player);
                if (otherPlayer) {
                    playerName = otherPlayer.name;
                }
            }

            game.selectDeck(playerName, player.deck);
        }

        game.initialise();
        if (pendingGame.rematch) {
            game.addAlert('info', 'The rematch is ready');
        }
    }

    /**
     * @param {import("../pendinggame")} pendingGame
     * @param {any} user
     */
    onSpectator(pendingGame, user) {
        const game = this.games[pendingGame.id];
        if (!game) {
            return;
        }

        game.watch('TBA', user);

        this.sendGameState(game);
    }

    onGameSync(callback) {
        const gameSummaries = Object.values(this.games).map((game) => {
            var retGame = game.getSummary(undefined, { fullData: true });
            retGame.password = game.password;

            return retGame;
        });

        logger.info(`syncing ${gameSummaries.length} games`);

        callback(gameSummaries);
    }

    /**
     * @param {string} gameId
     * @param {string} username
     */
    onFailedConnect(gameId, username) {
        const game = this.findGameForUser(username);
        if (!game || game.id !== gameId) {
            return;
        }

        game.failedConnect(username);

        if (game.isEmpty()) {
            delete this.games[game.id];

            this.gameSocket.send('GAMECLOSED', { game: game.id });
        }

        this.sendGameState(game);
    }

    /**
     * @param {string} gameId
     */
    onCloseGame(gameId) {
        let game = this.games[gameId];
        if (!game) {
            return;
        }

        for (let player of Object.values(game.getPlayersAndSpectators())) {
            player.socket.send('cleargamestate');
            player.socket.leaveChannel(game.id);
        }

        delete this.games[gameId];
        this.gameSocket.send('GAMECLOSED', { game: game.id });
    }

    onCardData(cardData) {
        this.cardData = cardData;
    }

    onConnection(ioSocket) {
        if (!ioSocket.request.user) {
            logger.info('socket connected with no user, disconnecting');
            ioSocket.disconnect();

            return;
        }

        let game = this.findGameForUser(ioSocket.request.user.username);
        if (!game) {
            logger.info(`No game for ${ioSocket.request.user.username} disconnecting`);
            ioSocket.disconnect();
            return;
        }

        let socket = new Socket(ioSocket, { configService: this.configService });

        let player = game.playersAndSpectators[socket.user.username];
        if (!player) {
            return;
        }

        player.lobbyId = player.id;
        player.id = socket.id;
        player.connectionSucceeded = true;

        if (player.disconnectedAt) {
            logger.info(`user '${socket.user.username} reconnected to game`);
            game.reconnect(socket, player.name);
        }

        socket.joinChannel(game.id);

        player.socket = socket;

        if (!game.isSpectator(player) && !player.disconnectedAt) {
            game.addAlert('info', '{0} has connected to the game server', player);
        }

        this.sendGameState(game);

        socket.registerEvent('game', this.onGameMessage.bind(this));
        socket.on('disconnect', this.onSocketDisconnected.bind(this));
    }

    onSocketDisconnected(socket, reason) {
        let game = this.findGameForUser(socket.user.username);
        if (!game) {
            return;
        }

        logger.info(`user '${socket.user.username}' disconnected from a game: ${reason}`);

        let player = game.playersAndSpectators[socket.user.username];
        if (player.id !== socket.id) {
            return;
        }

        let isSpectator = player && player.isSpectator();

        game.disconnect(socket.user.username);

        if (!socket.tIsClosing) {
            if (game.isEmpty()) {
                delete this.games[game.id];

                this.gameSocket.send('GAMECLOSED', { game: game.id });
            } else if (isSpectator) {
                this.gameSocket.send('PLAYERLEFT', {
                    gameId: game.id,
                    game: game.getSaveState(),
                    player: socket.user.username,
                    spectator: true
                });
            }
        }

        this.sendGameState(game);
    }

    onLeaveGame(socket) {
        let game = this.findGameForUser(socket.user.username);
        if (!game) {
            return;
        }

        let player = game.playersAndSpectators[socket.user.username];
        let isSpectator = player.isSpectator();

        game.leave(socket.user.username);

        this.gameSocket.send('PLAYERLEFT', {
            gameId: game.id,
            game: game.getSaveState(),
            player: socket.user.username,
            spectator: isSpectator
        });

        socket.send('cleargamestate');
        socket.leaveChannel(game.id);

        if (game.isEmpty()) {
            delete this.games[game.id];

            this.gameSocket.send('GAMECLOSED', { game: game.id });
        }

        this.sendGameState(game);
    }

    onGameMessage(socket, command, ...args) {
        let game = this.findGameForUser(socket.user.username);

        if (!game) {
            return;
        }

        if (command === 'leavegame') {
            return this.onLeaveGame(socket);
        }

        if (!game[command] || !(game[command] instanceof Function)) {
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
