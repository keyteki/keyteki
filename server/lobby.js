const socketio = require('socket.io');
const Socket = require('./socket.js');
const jwt = require('jsonwebtoken');
const _ = require('underscore');
const moment = require('moment');

const logger = require('./log');
const version = moment(require('../version').releaseDate);
const PendingGame = require('./pendinggame');
const GameRouter = require('./gamerouter');
const ServiceFactory = require('./services/ServiceFactory');
const DeckService = require('./services/DeckService');
const UserService = require('./services/UserService');
const ConfigService = require('./services/ConfigService');
const User = require('./models/User');
const { sortBy } = require('./Array');

class Lobby {
    constructor(server, options = {}) {
        this.sockets = {};
        this.users = {};
        this.games = {};
        this.configService = options.configService || new ConfigService();
        this.messageService = options.messageService || ServiceFactory.messageService();
        this.cardService = options.cardService || ServiceFactory.cardService(options.configService);
        this.userService = options.userService || new UserService(options.configService);
        this.deckService = options.deckService || new DeckService(this.configService);
        this.router = options.router || new GameRouter(this.configService);

        this.router.on('onGameClosed', this.onGameClosed.bind(this));
        this.router.on('onGameRematch', this.onGameRematch.bind(this));
        this.router.on('onPlayerLeft', this.onPlayerLeft.bind(this));
        this.router.on('onWorkerTimedOut', this.onWorkerTimedOut.bind(this));
        this.router.on('onNodeReconnected', this.onNodeReconnected.bind(this));
        this.router.on('onWorkerStarted', this.onWorkerStarted.bind(this));

        this.userService.on('onBlocklistChanged', this.onBlocklistChanged.bind(this));

        this.io = options.io || socketio(server, { perMessageDeflate: false });
        this.io.set('heartbeat timeout', 30000);
        this.io.use(this.handshake.bind(this));
        this.io.on('connection', this.onConnection.bind(this));

        this.messageService.on('messageDeleted', (messageId, user) => {
            for (let socket of Object.values(this.sockets)) {
                if (socket.user === user || (socket.user && socket.user.hasUserBlocked(user))) {
                    continue;
                }

                if (
                    socket.user &&
                    socket.user.permissions &&
                    socket.user.permissions.canModerateChat
                ) {
                    socket.send('removemessage', messageId, user.username);
                } else {
                    socket.send('removemessage', messageId);
                }
            }
        });

        setInterval(() => this.clearStalePendingGames(), 60 * 1000); // every minute
        setInterval(() => this.clearOldRefreshTokens(), 2 * 60 * 60 * 1000); // every 2 hours
    }

    async init() {
        // pre cache card list so the first user to the site doesn't have a slowdown
        await this.cardService.getAllCards();
    }

    // External methods
    getStatus() {
        return this.router.getNodeStatus();
    }

    disableNode(nodeName) {
        return this.router.disableNode(nodeName);
    }

    enableNode(nodeName) {
        return this.router.enableNode(nodeName);
    }

    debugDump() {
        let games = Object.values(this.games).map((game) => {
            let players = Object.values(game.players).map((player) => {
                return {
                    name: player.name,
                    left: player.left,
                    disconnected: player.disconnected,
                    id: player.id
                };
            });

            let spectators = Object.values(game.spectators).map((spectator) => {
                return {
                    name: spectator.name,
                    id: spectator.id
                };
            });

            return {
                name: game.name,
                players: players,
                spectators: spectators,
                id: game.id,
                started: game.started,
                node: game.node ? game.node.identity : 'None',
                startedAt: game.createdAt
            };
        });

        let nodes = this.router.getNodeStatus();

        return {
            games: games,
            nodes: nodes,
            socketCount: Object.values(this.sockets).length,
            userCount: Object.values(this.users).length
        };
    }

    // Helpers
    findGameForUser(user) {
        return Object.values(this.games).find((game) => {
            if (game.spectators[user]) {
                return true;
            }

            let player = game.players[user];

            if (!player || player.left) {
                return false;
            }

            return true;
        });
    }

    getUserList() {
        let userList = Object.values(this.users).map((user) => {
            return user.getShortSummary();
        });

        userList = sortBy(userList, (user) => {
            return user.name.toLowerCase();
        });

        return userList;
    }

    handshake(ioSocket, next) {
        let versionInfo = undefined;

        if (ioSocket.handshake.query.token && ioSocket.handshake.query.token !== 'undefined') {
            jwt.verify(
                ioSocket.handshake.query.token,
                this.configService.getValue('secret'),
                (err, user) => {
                    if (err) {
                        ioSocket.emit('authfailed');
                        return;
                    }

                    this.userService
                        .getUserById(user.id)
                        .then((dbUser) => {
                            let socket = this.sockets[ioSocket.id];
                            if (!socket) {
                                logger.error(
                                    'Tried to authenticate socket for %s but could not find it',
                                    dbUser.username
                                );
                                return;
                            }

                            if (dbUser.disabled) {
                                ioSocket.disconnect();
                                return;
                            }

                            ioSocket.request.user = dbUser.getWireSafeDetails();
                            socket.user = dbUser;
                            this.users[dbUser.username] = socket.user;

                            this.doPostAuth(socket);
                        })
                        .catch((err) => {
                            logger.error(err);
                        });
                }
            );
        }

        if (ioSocket.handshake.query.version) {
            versionInfo = moment(ioSocket.handshake.query.version);
        }

        if (!versionInfo || versionInfo < version) {
            ioSocket.emit(
                'banner',
                'Your client version is out of date, please refresh or clear your cache to get the latest version'
            );
        }

        next();
    }

    // Actions
    mapGamesToGameSummaries(games) {
        return _.chain(games)
            .map((game) => game.getSummary())
            .sortBy('createdAt')
            .sortBy('started')
            .reverse()
            .value();
    }

    broadcastGameMessage(message, games) {
        if (!Array.isArray(games)) {
            games = [games];
        }

        for (let socket of Object.values(this.sockets)) {
            if (!socket) {
                continue;
            }

            let filteredGames = Object.values(games).filter((game) =>
                game.isVisibleFor(socket.user)
            );
            let gameSummaries = filteredGames.map((game) => game.getSummary());

            socket.send(message, gameSummaries);
        }
    }

    broadcastGameList(socket) {
        let sockets = {};

        if (socket) {
            sockets[socket.id] = socket;
        } else {
            sockets = this.sockets;
        }

        for (let socket of Object.values(sockets)) {
            if (!socket) {
                continue;
            }

            let filteredGames = Object.values(this.games).filter((game) =>
                game.isVisibleFor(socket.user)
            );
            let gameSummaries = this.mapGamesToGameSummaries(filteredGames);

            socket.send('games', gameSummaries);
        }
    }

    sendUserListFilteredWithBlockList(socket, userList) {
        let filteredUsers = userList;

        if (socket.user) {
            filteredUsers = userList.filter((user) => {
                return !socket.user.hasUserBlocked(user);
            });
        }

        socket.send('users', filteredUsers);
    }

    broadcastUserMessage(user, message) {
        for (let socket of Object.values(this.sockets)) {
            if (socket.user === user || (socket.user && socket.user.hasUserBlocked(user))) {
                continue;
            }

            socket.send(message, user.getShortSummary());
        }
    }

    sendGameState(game) {
        if (game.started) {
            return;
        }

        for (let player of Object.values(game.getPlayersAndSpectators())) {
            if (!this.sockets[player.id]) {
                logger.info(`Wanted to send to ${player.id} but have no socket`);
                continue;
            }

            this.sockets[player.id].send('gamestate', game.getSummary(player.name));
        }
    }

    clearGamesForNode(nodeName) {
        for (let game of Object.values(this.games)) {
            if (game.node && game.node.identity === nodeName) {
                delete this.games[game.id];
            }
        }

        this.broadcastGameList();
    }

    clearStalePendingGames() {
        const timeout = 15 * 60 * 1000;
        let staleGames = Object.values(this.games).filter(
            (game) => !game.started && Date.now() - game.createdAt > timeout
        );

        for (let game of staleGames) {
            logger.info(`closed pending game ${game.id} due to inactivity`);
            delete this.games[game.id];
        }

        if (staleGames.length > 0) {
            this.broadcastGameMessage('removegame', staleGames);
        }
    }

    clearOldRefreshTokens() {
        logger.info('Starting refresh token cleanup...');

        this.userService.cleanupRefreshTokens().then(() => {
            logger.info('Refresh token cleanup completed.');
        });
    }

    sendFilteredMessages(socket) {
        this.messageService.getLastMessagesForUser(socket.user).then((messages) => {
            let messagesToSend = this.filterMessages(messages, socket);
            socket.send('lobbymessages', messagesToSend.reverse());
        });
    }

    filterMessages(messages, socket) {
        if (!socket.user) {
            return messages;
        }

        return messages.filter((message) => {
            return !socket.user.hasUserBlocked(message.user);
        });
    }

    // Events
    onConnection(ioSocket) {
        let socket = new Socket(ioSocket, { configService: this.configService });

        socket.registerEvent('chat', this.onPendingGameChat.bind(this));
        socket.registerEvent('clearsessions', this.onClearSessions.bind(this));
        socket.registerEvent('connectfailed', this.onConnectFailed.bind(this));
        socket.registerEvent('getnodestatus', this.onGetNodeStatus.bind(this));
        socket.registerEvent('getsealeddeck', this.onGetSealedDeck.bind(this));
        socket.registerEvent('joingame', this.onJoinGame.bind(this));
        socket.registerEvent('leavegame', this.onLeaveGame.bind(this));
        socket.registerEvent('lobbychat', this.onLobbyChat.bind(this));
        socket.registerEvent('motd', this.onMotdChange.bind(this));
        socket.registerEvent('newgame', this.onNewGame.bind(this));
        socket.registerEvent('removegame', this.onRemoveGame.bind(this));
        socket.registerEvent('restartnode', this.onRestartNode.bind(this));
        socket.registerEvent('selectdeck', this.onSelectDeck.bind(this));
        socket.registerEvent('startgame', this.onStartGame.bind(this));
        socket.registerEvent('togglenode', this.onToggleNode.bind(this));
        socket.registerEvent('watchgame', this.onWatchGame.bind(this));

        socket.on('authenticate', this.onAuthenticated.bind(this));
        socket.on('disconnect', this.onSocketDisconnected.bind(this));

        this.sockets[ioSocket.id] = socket;

        if (socket.user) {
            this.users[socket.user.username] = socket.user;

            this.broadcastUserMessage(socket.user, 'newuser');
        }

        this.sendUserListFilteredWithBlockList(socket, this.getUserList());
        this.sendFilteredMessages(socket);
        this.broadcastGameList(socket);

        this.messageService
            .getMotdMessage()
            .then((message) => {
                if (message) {
                    socket.send('motd', message);
                }
            })
            .catch((err) => {
                logger.error(err);
            });

        if (!socket.user) {
            return;
        }

        let game = this.findGameForUser(socket.user.username);
        if (game && game.started) {
            this.sendHandoff(socket, game.node, game.id);
        }
    }

    doPostAuth(socket) {
        let user = socket.user;

        if (!user) {
            return;
        }

        this.broadcastUserMessage(user, 'newuser');
        this.sendFilteredMessages(socket);
        this.sendUserListFilteredWithBlockList(socket, this.getUserList());

        this.broadcastGameList(socket);

        let game = this.findGameForUser(user.username);
        if (game && game.started) {
            this.sendHandoff(socket, game.node, game.id);
        }
    }

    onAuthenticated(socket, user) {
        if (socket.user) {
            return;
        }

        this.userService
            .getUserById(user.id)
            .then((dbUser) => {
                this.users[dbUser.username] = dbUser;
                socket.user = dbUser;

                this.doPostAuth(socket);
            })
            .catch((err) => {
                logger.error(err);
            });
    }

    onSocketDisconnected(socket, reason) {
        if (!socket) {
            return;
        }

        delete this.sockets[socket.id];

        if (!socket.user) {
            return;
        }

        this.broadcastUserMessage(socket.user, 'userleft');

        delete this.users[socket.user.username];

        logger.info(`user '${socket.user.username}' disconnected from the lobby: ${reason}`);

        let game = this.findGameForUser(socket.user.username);
        if (!game) {
            return;
        }

        game.disconnect(socket.user.username);

        if (game.isEmpty() && !game.tournament) {
            this.broadcastGameMessage('removegame', game);
            delete this.games[game.id];
        } else {
            this.broadcastGameMessage('updategame', game);
            this.sendGameState(game);
        }
    }

    onNewGame(socket, gameDetails) {
        if (!socket.user.permissions.canManageTournaments || !gameDetails.tournament) {
            let existingGame = this.findGameForUser(socket.user.username);
            if (existingGame) {
                return;
            }
        }

        if (gameDetails.quickJoin) {
            let sortedGames = sortBy(Object.values(this.games), (game) => game.createdAt);
            let gameToJoin = sortedGames.find(
                (game) =>
                    !game.started &&
                    game.gameType === gameDetails.gameType &&
                    game.gameFormat === gameDetails.gameFormat &&
                    Object.values(game.players).length < 2 &&
                    !game.password &&
                    !game.gamePrivate
            );

            if (gameToJoin) {
                let message = gameToJoin.join(socket.id, socket.user);
                if (message) {
                    socket.send('passworderror', message);

                    return;
                }

                socket.joinChannel(gameToJoin.id);

                this.sendGameState(gameToJoin);
                this.broadcastGameMessage('updategame', gameToJoin);

                return;
            }
        }

        let game = new PendingGame(socket.user, gameDetails);
        game.newGame(socket.id, socket.user, gameDetails.password, !game.challonge);
        socket.joinChannel(game.id);

        this.sendGameState(game);

        this.games[game.id] = game;
        this.broadcastGameMessage('newgame', game);
    }

    onJoinGame(socket, gameId, password) {
        let existingGame = this.findGameForUser(socket.user.username);
        if (existingGame) {
            return;
        }

        let game = this.games[gameId];
        if (!game) {
            return;
        }

        let message = game.join(socket.id, socket.user, password);
        if (message) {
            socket.send('passworderror', message);

            return;
        }

        socket.joinChannel(game.id);

        this.sendGameState(game);
        this.broadcastGameMessage('updategame', game);
    }

    onStartGame(socket, gameId) {
        let game = this.games[gameId];

        if (!game || game.started) {
            return;
        }

        if (
            Object.values(game.getPlayers()).some((player) => {
                return !player.deck;
            })
        ) {
            return;
        }

        if (!game.isOwner(socket.user.username)) {
            return;
        }

        let gameNode = this.router.startGame(game);
        if (!gameNode) {
            socket.send('gameerror', 'No game nodes available. Try again later.');
            return;
        }

        game.node = gameNode;
        game.started = true;

        this.broadcastGameMessage('updategame', game);

        for (let player of Object.values(game.getPlayersAndSpectators())) {
            let socket = this.sockets[player.id];

            if (!socket || !socket.user) {
                logger.error(`Wanted to handoff to ${player.name}, but couldn't find a socket`);
                continue;
            }

            this.sendHandoff(socket, gameNode, game.id);
        }
    }

    sendHandoff(socket, gameNode, gameId) {
        let user = socket.user.getWireSafeDetails();
        let authToken = jwt.sign(user, this.configService.getValue('secret'), { expiresIn: '5m' });

        socket.send('handoff', {
            address: gameNode.address,
            authToken: authToken,
            gameId: gameId,
            name: gameNode.identity,
            port: gameNode.port,
            protocol: gameNode.protocol,
            user: user
        });
    }

    onWatchGame(socket, gameId, password) {
        let existingGame = this.findGameForUser(socket.user.username);
        if (existingGame) {
            return;
        }

        let game = this.games[gameId];
        if (!game) {
            return;
        }

        let message = game.watch(socket.id, socket.user, password);
        if (message) {
            socket.send('passworderror', message);

            return;
        }

        socket.joinChannel(game.id);

        if (game.started) {
            this.router.addSpectator(game, socket.user.getDetails());
            this.sendHandoff(socket, game.node, game.id);
        } else {
            this.sendGameState(game);
        }
    }

    onLeaveGame(socket) {
        let game = this.findGameForUser(socket.user.username);
        if (!game) {
            return;
        }

        game.leave(socket.user.username);
        socket.send('cleargamestate');
        socket.leaveChannel(game.id);

        if (game.isEmpty() && !game.tournament) {
            delete this.games[game.id];
            this.broadcastGameMessage('removegame', game);
        } else {
            this.sendGameState(game);
            this.broadcastGameMessage('updategame', game);
        }
    }

    onPendingGameChat(socket, message) {
        let game = this.findGameForUser(socket.user.username);
        if (!game) {
            return;
        }

        game.chat(socket.user.username, message);
        this.sendGameState(game);
    }

    async onLobbyChat(socket, message) {
        if (
            Date.now() - socket.user.registered <
            this.configService.getValue('minLobbyChatTime') * 1000
        ) {
            socket.send('nochat');
            return;
        }

        let chatMessage = { message: message, time: new Date() };
        let newMessage = await this.messageService.addMessage(chatMessage, socket.user);
        newMessage.user = socket.user.getShortSummary();

        for (let s of Object.values(this.sockets)) {
            if (s.user && s.user.hasUserBlocked(socket.user)) {
                continue;
            }

            s.send('lobbychat', newMessage);
        }
    }

    onGetSealedDeck(socket, gameId) {
        let game = this.games[gameId];
        if (!game) {
            return;
        }

        Promise.all([
            this.cardService.getAllCards(),
            this.deckService.getSealedDeck(game.expansions)
        ])
            .then((results) => {
                let [cards, deck] = results;

                for (let card of deck.cards) {
                    card.card = cards[card.id];
                }

                deck.status = {
                    basicRules: true,
                    extendedStatus: [],
                    flagged: false,
                    noUnreleasedCards: true,
                    officialRole: true,
                    usageLevel: 0,
                    verified: true
                };

                game.selectDeck(socket.user.username, deck);

                this.sendGameState(game);
            })
            .catch((err) => {
                logger.info(err);

                return;
            });
    }

    onSelectDeck(socket, gameId, deckId, isStandalone) {
        let game = this.games[gameId];
        if (!game) {
            return;
        }

        return Promise.all([
            this.cardService.getAllCards(),
            isStandalone
                ? this.deckService.getStandaloneDeckById(deckId)
                : this.deckService.getById(deckId)
        ])
            .then((results) => {
                let [cards, deck] = results;

                for (let card of deck.cards) {
                    let house = card.house;

                    card.card = cards[card.id];
                    if (house) {
                        card.house = house;
                    }
                }

                let deckUsageLevel = 0;
                if (
                    deck.usageCount >
                    this.configService.getValueForSection('lobby', 'lowerDeckThreshold')
                ) {
                    deckUsageLevel = 1;
                }

                if (
                    deck.usageCount >
                    this.configService.getValueForSection('lobby', 'middleDeckThreshold')
                ) {
                    deckUsageLevel = 2;
                }

                if (
                    deck.usageCount >
                    this.configService.getValueForSection('lobby', 'upperDeckThreshold')
                ) {
                    deckUsageLevel = 3;
                }

                let hasEnhancementsSet = true;
                let hasEnhancements = false;
                if (deck.cards.some((c) => c.enhancements && c.enhancements[0] === '')) {
                    hasEnhancementsSet = false;
                }

                if (deck.cards.some((c) => c.enhancements)) {
                    hasEnhancements = true;
                }

                deck.status = {
                    basicRules: hasEnhancementsSet,
                    notVerified: hasEnhancements && !deck.verified,
                    extendedStatus: [],
                    noUnreleasedCards: true,
                    officialRole: true,
                    usageLevel: deckUsageLevel,
                    verified: !!deck.verified
                };

                deck.usageCount = 0;

                game.selectDeck(socket.user.username, deck);

                this.sendGameState(game);
            })
            .catch((err) => {
                logger.info(err);

                return;
            });
    }

    onConnectFailed(socket) {
        let game = this.findGameForUser(socket.user.username);
        if (!game) {
            return;
        }

        logger.info("user '%s' failed to handoff to game server", socket.user.username);
        this.router.notifyFailedConnect(game, socket.user.username);
    }

    onRemoveGame(socket, gameId) {
        if (!socket.user.permissions.canManageGames) {
            return;
        }

        let game = this.games[gameId];
        if (!game) {
            return;
        }

        logger.info(`${socket.user.username} closed game ${game.id} (${game.name}) forcefully`);

        if (!game.started) {
            delete this.games[game.id];
        } else {
            this.router.closeGame(game);
        }

        this.broadcastGameMessage('removegame', game);
    }

    onGetNodeStatus(socket) {
        if (!socket.user.permissions.canManageNodes) {
            return;
        }

        socket.send('nodestatus', this.router.getNodeStatus());
    }

    onToggleNode(socket, node) {
        if (!socket.user.permissions.canManageNodes) {
            return;
        }

        this.router.toggleNode(node);

        socket.send('nodestatus', this.router.getNodeStatus());
    }

    onRestartNode(socket, node) {
        if (!socket.user.permissions.canManageNodes) {
            return;
        }

        this.router.restartNode(node);

        socket.send('nodestatus', this.router.getNodeStatus());
    }

    onMotdChange(socket, motd) {
        if (!socket.user.permissions.canManageMotd) {
            return;
        }

        let newMotd =
            motd && motd.message
                ? {
                      message: motd.message,
                      motdType: motd.motdType,
                      type: 'motd',
                      time: new Date()
                  }
                : {};

        this.messageService
            .setMotdMessage(newMotd, socket.user)
            .then(() => {
                this.io.emit('motd', { message: newMotd.message, motdType: newMotd.motdType });
            })
            .catch((err) => {
                logger.error(err);
            });
    }

    // router Events
    onGameClosed(gameId) {
        let game = this.games[gameId];

        if (!game) {
            return;
        }

        this.broadcastGameMessage('removegame', game);
        delete this.games[gameId];
    }

    onGameRematch(oldGame) {
        let gameId = oldGame.gameId;
        let game = this.games[gameId];

        if (!game) {
            return;
        }

        this.broadcastGameMessage('removegame', game);
        delete this.games[gameId];

        let newGame = new PendingGame(game.owner, {
            adaptive: game.adaptive,
            gameFormat: game.gameFormat,
            gameTimeLimit: game.gameTimeLimit,
            gameType: game.gameType,
            hideDecklists: game.hideDecklists,
            showHand: game.showHand,
            spectators: game.allowSpectators,
            swap: oldGame.swap,
            useGameTimeLimit: game.useGameTimeLimit
        });
        newGame.rematch = true;
        newGame.previousWinner = oldGame.winner;

        let owner = game.getPlayerOrSpectator(game.owner.username);
        if (!owner) {
            logger.error("Tried to rematch but the owner wasn't in the game");
            return;
        }

        let socket = this.sockets[owner.id];
        if (!socket) {
            logger.error("Tried to rematch but the owner's socket has gone away");
            return;
        }

        this.games[newGame.id] = newGame;
        newGame.newGame(socket.id, socket.user);

        socket.joinChannel(newGame.id);
        this.sendGameState(newGame);
        this.broadcastGameMessage('newgame', newGame);

        let promises = [
            this.onSelectDeck(socket, newGame.id, owner.deck.id, owner.deck.isStandalone)
        ];

        for (let player of Object.values(game.getPlayers()).filter(
            (player) => player.name !== owner.username
        )) {
            let socket = this.sockets[player.id];

            if (!socket) {
                logger.warn(
                    `Tried to add ${player.name} to a rematch but couldn't find their socket`
                );
                continue;
            }

            newGame.join(socket.id, player.user);
            promises.push(
                this.onSelectDeck(socket, newGame.id, player.deck.id, player.deck.isStandalone)
            );
        }

        for (let player of Object.values(game.getPlayers())) {
            let oldPlayer = oldGame.players.find((x) => x.name === player.name);

            if (oldPlayer && oldPlayer.wins) {
                if (!newGame.players[player.name]) {
                    logger.warn(
                        `Tried to set ${player.name} wins but couldn't find them in the game`
                    );
                    continue;
                }

                newGame.players[player.name].wins = oldPlayer.wins;
            }
        }

        for (let spectator of game.getSpectators()) {
            let socket = this.sockets[spectator.id];

            if (!socket) {
                logger.warn(
                    `Tried to add ${spectator.name} to spectate a rematch but couldn't find their socket`
                );
                continue;
            }

            newGame.watch(socket.id, spectator.user);
        }

        // Set the password after everyone has joined, so we don't need to worry about overriding the password, or storing it unencrypted/hashed
        newGame.password = game.password;

        Promise.all(promises).then(() => {
            this.onStartGame(socket, newGame.id);
        });
    }

    onPlayerLeft(gameId, player) {
        let game = this.games[gameId];

        if (!game) {
            return;
        }

        game.leave(player);

        if (game.isEmpty()) {
            this.broadcastGameMessage('removegame', game);
            delete this.games[gameId];
        } else {
            this.broadcastGameMessage('updategame', game);
        }
    }

    onBlocklistChanged(user) {
        let updatedUser = this.users[user.username];

        if (!updatedUser) {
            return;
        }

        updatedUser.blockList = user.blockList;
    }

    onWorkerTimedOut(nodeName) {
        this.clearGamesForNode(nodeName);
    }

    onWorkerStarted() {}

    onClearSessions(socket, username) {
        this.userService.clearUserSessions(username).then((success) => {
            if (!success) {
                logger.error(`Failed to clear sessions for user ${username}`);
                return;
            }

            let game = this.findGameForUser(username);

            if (game) {
                logger.info(
                    `closed game ${game.id} (${game.name}) forcefully due to clear session on ${username}`
                );

                if (!game.started) {
                    delete this.games[game.id];
                } else {
                    this.router.closeGame(game);
                }
            }

            let socket = Object.values(this.sockets).find((socket) => {
                return socket.user && socket.user.username === username;
            });

            if (socket) {
                socket.disconnect();
            }
        });
    }

    onNodeReconnected(nodeName, games) {
        for (let game of Object.values(games)) {
            let owner = game.players[game.owner];

            if (!owner) {
                logger.error("Got a game where the owner %s wasn't a player", game.owner);
                continue;
            }

            let syncGame = new PendingGame(new User(owner.user), {
                spectators: game.allowSpectators,
                name: game.name
            });
            syncGame.adaptive = game.adaptive;
            syncGame.createdAt = game.startedAt;
            syncGame.gameFormat = game.gameFormat;
            syncGame.gamePrivate = game.gamePrivate;
            syncGame.gameType = game.gameType;
            syncGame.id = game.id;
            syncGame.node = this.router.workers[nodeName];
            syncGame.password = game.password;
            syncGame.started = game.started;

            for (let player of Object.values(game.players)) {
                syncGame.players[player.name] = {
                    id: player.id,
                    name: player.name,
                    owner: game.owner === player.name,
                    faction: { cardData: { code: player.faction } },
                    user: new User(player.user)
                };
            }

            for (let player of Object.values(game.spectators)) {
                syncGame.spectators[player.name] = {
                    id: player.id,
                    name: player.name,
                    user: new User(player.user)
                };
            }

            this.games[syncGame.id] = syncGame;
        }

        for (let game of Object.values(this.games)) {
            if (
                game.node &&
                game.node.identity === nodeName &&
                Object.values(games).find((nodeGame) => {
                    return nodeGame.id === game.id;
                })
            ) {
                this.games[game.id] = game;
            } else if (game.node && game.node.identity === nodeName) {
                delete this.games[game.id];
            }
        }

        this.broadcastGameList();
    }
}

module.exports = Lobby;
