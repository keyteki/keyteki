const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const Sentry = require('@sentry/node');
const http = require('http');
const https = require('https');
const fs = require('fs');
const { URL } = require('url');
const jsondiffpatch = require('jsondiffpatch').create({
    objectHash: (obj, index) => {
        return obj.uuid || obj.name || obj.id || obj._id || '$$index:' + index;
    }
});

const { detectBinary } = require('../util');
const logger = require('../log');
const GameSocket = require('./gamesocket');
const Game = require('../game/game');
const Socket = require('../socket');
const ConfigService = require('../services/ConfigService');
const HealthServer = require('./healthserver.js');

class GameServer {
    constructor() {
        this.configService = new ConfigService();
        const sentryDsn = this.configService.getValue('sentryDsn');

        if (sentryDsn) {
            Sentry.init({ dsn: sentryDsn, release: process.env.VERSION || 'Local build' });
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

        this.host =
            process.env.HOST ||
            this.configService.getValueForSection('gameNode', 'host') ||
            undefined;

        this.gameSocket = new GameSocket(
            this.configService,
            this.host,
            this.protocol,
            process.env.VERSION || 'Local build'
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

        const socketioPort = this.configService.getValueForSection('gameNode', 'socketioPort');

        server.listen(process.env.PORT || socketioPort, '0.0.0.0');

        let options = {
            perMessageDeflate: false,
            pingTimeout: 15000
        };

        const nodeIdentity =
            process.env.SERVER || this.configService.getValueForSection('gameNode', 'name');
        if (nodeIdentity) {
            options.path = '/' + nodeIdentity + '/socket.io';
        }

        const corsOrigin = this.configService.getValueForSection('gameNode', 'origin');
        if (corsOrigin) {
            options.cors = { origin: corsOrigin, credentials: true };
        } else if (this.configService.getValue('env') !== 'production') {
            // In local/dev environments the lobby and game node commonly run on different ports.
            // Allow localhost/127.0.0.1 origins so Socket.IO polling responses include CORS headers.
            options.cors = {
                origin: (origin, callback) => {
                    if (!origin) {
                        callback(null, true);
                        return;
                    }

                    try {
                        const parsedOrigin = new URL(origin);
                        const host = parsedOrigin.hostname.toLowerCase();
                        const isLocalHost = host === 'localhost' || host === '127.0.0.1';

                        callback(null, isLocalHost);
                    } catch (err) {
                        callback(null, false);
                    }
                },
                credentials: true
            };
        }

        logger.info(
            `Listening on 0.0.0.0:${process.env.PORT || socketioPort}/${
                process.env.SERVER || nodeIdentity
            }/socket.io`
        );

        this.io = new Server(server, options);
        this.io.use(this.handshake.bind(this));

        this.io.on('connection', this.onConnection.bind(this));

        setInterval(() => this.clearStaleAndFinishedGames(), 30 * 1000);

        this.healthServer = new HealthServer(this);
        this.healthServer.start();
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
        if (game.errorHandling) {
            logger.error('Error during error handling, suppressing to avoid loop:', e);
            return;
        }

        game.errorHandling = true;

        try {
            logger.error(e);

            let debugData = /** @type {Record<string, any>} */ ({});

            try {
                let gameState = game.getState();

                if (e.message.includes('Maximum call stack')) {
                    debugData.badSerializaton = detectBinary(gameState);
                } else {
                    debugData.game = gameState;
                    debugData.game.players = undefined;

                    debugData.messages = game.getPlainTextLog();
                    debugData.game.messages = undefined;

                    for (const player of game.getPlayers()) {
                        debugData[player.name] = player.getState(player);
                    }
                }
            } catch (diagnosticError) {
                logger.error('Failed to collect diagnostic data:', diagnosticError);
            }

            Sentry.withScope((scope) => {
                scope.setExtra('extra', debugData);
                Sentry.captureException(e);
            });

            try {
                if (game) {
                    game.addMessage(
                        'A Server error has occurred processing your game state, apologies.  Your game may now be in an inconsistent state, or you may be able to continue.  The error has been logged.'
                    );
                }
            } catch (messageError) {
                logger.error('Failed to add error message to game:', messageError);
            }
        } finally {
            game.errorHandling = false;
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

        // Re-evaluate per-player idle state on active games and push any changes
        // to clients. This piggybacks on the 30s sweep so there's no extra timer.
        for (const game of Object.values(this.games)) {
            if (game.finishedAt) {
                continue;
            }
            if (game.updateIdleState()) {
                this.sendGameState(game);
            }
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

            try {
                this.sendGameState(game);
            } catch (sendError) {
                logger.error('Failed to send game state after error:', sendError);
            }
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

            let state = game.getState(player.name);

            let stateToSend = state;

            if (game.jsonForUsers[player.name]) {
                stateToSend = jsondiffpatch.diff(game.jsonForUsers[player.name], state);
            }

            player.socket.send('gamestate', stateToSend);

            game.jsonForUsers[player.name] = jsondiffpatch.clone(state);
        }
    }

    /**
     * @param {import("socket.io").Socket} socket
     * @param {() => void} next
     */
    handshake(socket, next) {
        const token = socket.handshake.auth?.token || socket.handshake.query?.token;
        if (token && token !== 'undefined') {
            jwt.verify(token, this.configService.getValue('secret'), function (err, user) {
                if (err) {
                    return;
                }

                socket.request.user = user;
            });
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
     * @param {import("../game/game")} game
     */
    rematchWithNewDecks(game) {
        this.gameSocket.send('REMATCHWITHNEWDECKS', { game: game.getSaveState() });

        for (let player of Object.values(game.getPlayersAndSpectators())) {
            if (player.left || player.disconnectedAt || !player.socket) {
                continue;
            }

            player.socket.send('cleargamestate');
            player.socket.leaveChannel(game.id);
            player.left = true;
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
        const game = this.games[pendingGame.gameId];
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
        game.jsonForUsers[player.name] = undefined;

        if (!game.isSpectator(player) && !player.disconnectedAt) {
            game.addAlert('info', '{0} has connected to the game server', player);
        } else if (game.isSpectator(player) && player.disconnectedAt) {
            game.addAlert('info', '{0} reconnected to the game as a spectator', player);
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
            this.sendGameState(game);
        } else {
            // Re-run the pipeline so any prompts currently waiting on the
            // departing player (e.g. the post-game rematch prompt) can
            // recompute their buttons / completion based on the new
            // `player.left` state. Without this, the remaining player keeps
            // seeing stale buttons until the next game action.
            this.runAndCatchErrors(game, () => {
                game.continue();
                this.sendGameState(game);
            });
        }
    }

    onGameMessage(socket, command, ...args) {
        let game = this.findGameForUser(socket.user.username);

        if (!game) {
            return;
        }

        if (command === 'leavegame') {
            return this.onLeaveGame(socket);
        }

        if (command === 'activity') {
            // Lightweight client-driven activity heartbeat. Just refresh the
            // player's lastActivityAt; only push state if the idle flag was
            // cleared so the opponent can see they're back.
            const idleCleared = game.noteActivity(socket.user.username);
            if (idleCleared) {
                this.sendGameState(game);
            }
            return;
        }

        // Some client commands (e.g. `showDrawDeck`) are UI sync messages
        // fired automatically by React effects on every gamestate diff, not
        // by user input. Only treat the command as activity if it actually
        // maps to a real game method — otherwise the act of going idle (which
        // pushes a state diff) would itself bounce back as auto-emitted
        // commands and clear the idle flag immediately.
        if (!game[command] || !(game[command] instanceof Function)) {
            return;
        }

        game.noteActivity(socket.user.username);

        this.runAndCatchErrors(game, () => {
            game[command](socket.user.username, ...args);

            game.continue();

            this.sendGameState(game);
        });
    }
}

module.exports = GameServer;
