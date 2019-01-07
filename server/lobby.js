const socketio = require('socket.io');
const Socket = require('./socket.js');
const jwt = require('jsonwebtoken');
const _ = require('underscore');
const moment = require('moment');

const logger = require('./log.js');
const version = moment(require('../version.js'));
const PendingGame = require('./pendinggame.js');
const GameRouter = require('./gamerouter.js');
const ServiceFactory = require('./services/ServiceFactory');
const DeckService = require('./services/DeckService.js');
const CardService = require('./services/CardService.js');
const UserService = require('./services/UserService.js');

class Lobby {
    constructor(server, options = {}) {
        this.sockets = {};
        this.users = {};
        this.games = {};
        this.config = options.config;
        this.messageService = options.messageService || ServiceFactory.messageService(options.db);
        this.deckService = options.deckService || new DeckService(options.db);
        this.cardService = options.cardService || new CardService(options.db);
        this.userService = options.userService || new UserService(options.db);
        this.router = options.router || new GameRouter(this.config);

        this.router.on('onGameClosed', this.onGameClosed.bind(this));
        this.router.on('onPlayerLeft', this.onPlayerLeft.bind(this));
        this.router.on('onWorkerTimedOut', this.onWorkerTimedOut.bind(this));
        this.router.on('onNodeReconnected', this.onNodeReconnected.bind(this));
        this.router.on('onWorkerStarted', this.onWorkerStarted.bind(this));

        this.io = options.io || socketio(server, { perMessageDeflate: false });
        this.io.set('heartbeat timeout', 30000);
        this.io.use(this.handshake.bind(this));
        this.io.on('connection', this.onConnection.bind(this));

        this.lastUserBroadcast = moment();

        this.messageService.on('messageDeleted', messageId => {
            this.io.emit('removemessage', messageId);
        });

        setInterval(() => this.clearStalePendingGames(), 60 * 1000);
    }

    // External methods
    getStatus() {
        var nodeStatus = this.router.getNodeStatus();

        return nodeStatus;
    }

    disableNode(nodeName) {
        return this.router.disableNode(nodeName);
    }

    enableNode(nodeName) {
        return this.router.enableNode(nodeName);
    }

    debugDump() {
        var games = _.map(this.games, game => {
            var players = _.map(game.players, player => {
                return {
                    name: player.name,
                    left: player.left,
                    disconnected: player.disconnected,
                    id: player.id
                };
            });

            var spectators = _.map(game.spectators, spectator => {
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

        var nodes = this.router.getNodeStatus();

        return {
            games: games,
            nodes: nodes,
            socketCount: _.size(this.sockets),
            userCount: _.size(this.users)
        };
    }

    // Helpers
    findGameForUser(user) {
        return _.find(this.games, game => {
            if(game.spectators[user]) {
                return true;
            }

            var player = game.players[user];

            if(!player || player.left) {
                return false;
            }

            return true;
        });
    }

    getUserList() {
        let userList = Object.values(this.users).map(user => {
            return user.getShortSummary();
        });

        userList = _.sortBy(userList, user => {
            return user.name.toLowerCase();
        });

        return userList;
    }

    handshake(ioSocket, next) {
        var versionInfo = undefined;

        if(ioSocket.handshake.query.token && ioSocket.handshake.query.token !== 'undefined') {
            jwt.verify(ioSocket.handshake.query.token, this.config.secret, (err, user) => {
                if(err) {
                    ioSocket.emit('authfailed');
                    return;
                }

                this.userService.getUserById(user._id).then(dbUser => {
                    var socket = this.sockets[ioSocket.id];
                    if(!socket) {
                        logger.error('Tried to authenticate socket but could not find it', dbUser.username);
                        return;
                    }

                    ioSocket.request.user = dbUser.getWireSafeDetails();
                    socket.user = dbUser;

                    this.doPostAuth(socket);
                }).catch(err => {
                    logger.error(err);
                });
            });
        }

        if(ioSocket.handshake.query.version) {
            versionInfo = moment(ioSocket.handshake.query.version);
        }

        if(!versionInfo || versionInfo < version) {
            ioSocket.emit('banner', 'Your client version is out of date, please refresh or clear your cache to get the latest version');
        }

        next();
    }

    // Actions
    filterGameListWithBlockList(user, games) {
        if(!user) {
            return games;
        }

        return _.filter(games, game => {
            let userBlockedByOwner = this.games[game.id].isUserBlocked(user);
            let userHasBlockedPlayer = _.any(this.games[game.id].players, player => _.contains(user.blockList, player.name.toLowerCase()));
            return !userBlockedByOwner && !userHasBlockedPlayer;
        });
    }

    sendUserListFilteredWithBlockList(socket, userList) {
        let filteredUsers = userList;

        if(socket.user) {
            filteredUsers = _.reject(userList, user => {
                return _.contains(socket.user.blockList, user.name.toLowerCase());
            });
        }

        socket.send('users', filteredUsers);
    }

    sortGameSummaries(gameSummaries) {
        return _.chain(gameSummaries)
            .sortBy(game => game.createdAt.toString() + game.started ? 1 : 0)
            .reverse()
            .value();
    }

    broadcastGameList(socket, options = { force: false }) {
        var now = moment();

        if((now - this.lastGameStateBroadcast) < 750 && !options.force) {
            return;
        }

        const gameSummaries = _.map(this.games, game => game.getSummary());

        let sockets = socket ? [socket] : this.sockets;
        _.each(sockets, socket => {
            let filteredGames = this.filterGameListWithBlockList(socket.user, gameSummaries);
            let sortedGames = this.sortGameSummaries(filteredGames);

            socket.send('games', sortedGames);
        });

        this.lastGameStateBroadcast = moment();
    }

    broadcastUserList() {
        var now = moment();

        if((now - this.lastUserBroadcast) / 1000 < 60) {
            return;
        }

        this.lastUserBroadcast = moment();

        let users = this.getUserList();

        _.each(this.sockets, socket => {
            this.sendUserListFilteredWithBlockList(socket, users);
        });
    }

    sendGameState(game) {
        if(game.started) {
            return;
        }

        _.each(game.getPlayersAndSpectators(), player => {
            if(!this.sockets[player.id]) {
                logger.info('Wanted to send to ', player.id, ' but have no socket');
                return;
            }

            this.sockets[player.id].send('gamestate', game.getSummary(player.name));
        });
    }

    clearGamesForNode(nodeName) {
        _.each(this.games, game => {
            if(game.node && game.node.identity === nodeName) {
                delete this.games[game.id];
            }
        });

        this.broadcastGameList();
    }

    clearStalePendingGames() {
        const timeout = 15 * 60 * 1000;
        let staleGames = _.filter(this.games, game => !game.started && Date.now() - game.createdAt > timeout);
        for(let game of staleGames) {
            logger.info('closed pending game', game.id, 'due to inactivity');
            delete this.games[game.id];
        }

        if(staleGames.length > 0) {
            this.broadcastGameList();
        }
    }

    sendFilteredMessages(socket) {
        this.messageService.getLastMessages().then(messages => {
            let messagesToSend = this.filterMessages(messages, socket);
            socket.send('lobbymessages', messagesToSend.reverse());
        });
    }

    filterMessages(messages, socket) {
        if(!socket.user) {
            return messages;
        }

        return messages.filter(message => {
            return !_.contains(socket.user.blockList, message.user.username.toLowerCase());
        });
    }

    // Events
    onConnection(ioSocket) {
        var socket = new Socket(ioSocket, { config: this.config });

        socket.registerEvent('lobbychat', this.onLobbyChat.bind(this));
        socket.registerEvent('newgame', this.onNewGame.bind(this));
        socket.registerEvent('joingame', this.onJoinGame.bind(this));
        socket.registerEvent('leavegame', this.onLeaveGame.bind(this));
        socket.registerEvent('watchgame', this.onWatchGame.bind(this));
        socket.registerEvent('startgame', this.onStartGame.bind(this));
        socket.registerEvent('chat', this.onPendingGameChat.bind(this));
        socket.registerEvent('selectdeck', this.onSelectDeck.bind(this));
        socket.registerEvent('getsealeddeck', this.onGetSealedDeck.bind(this));
        socket.registerEvent('connectfailed', this.onConnectFailed.bind(this));
        socket.registerEvent('removegame', this.onRemoveGame.bind(this));
        socket.registerEvent('clearsessions', this.onClearSessions.bind(this));
        socket.registerEvent('getnodestatus', this.onGetNodeStatus.bind(this));
        socket.registerEvent('togglenode', this.onToggleNode.bind(this));
        socket.registerEvent('restartnode', this.onRestartNode.bind(this));

        socket.on('authenticate', this.onAuthenticated.bind(this));
        socket.on('disconnect', this.onSocketDisconnected.bind(this));

        this.sockets[ioSocket.id] = socket;

        if(socket.user) {
            this.users[socket.user.username] = socket.user;

            this.broadcastUserList();
        }

        // Force user list send for the newly connected socket, bypassing the throttle
        this.sendUserListFilteredWithBlockList(socket, this.getUserList());
        this.sendFilteredMessages(socket);
        this.broadcastGameList(socket, { force: true });

        if(!socket.user) {
            return;
        }

        var game = this.findGameForUser(socket.user.username);
        if(game && game.started) {
            this.sendHandoff(socket, game.node, game.id);
        }
    }

    doPostAuth(socket) {
        let user = socket.user;

        if(!user) {
            return;
        }

        this.broadcastUserList();
        this.sendFilteredMessages(socket);
        // Force user list send for the newly autnenticated socket, bypassing the throttle
        this.sendUserListFilteredWithBlockList(socket, this.getUserList());

        this.broadcastGameList(socket, { force: true });

        var game = this.findGameForUser(user.username);
        if(game && game.started) {
            this.sendHandoff(socket, game.node, game.id);
        }
    }

    onAuthenticated(socket, user) {
        this.userService.getUserById(user._id).then(dbUser => {
            this.users[dbUser.username] = dbUser;
            socket.user = dbUser;

            this.doPostAuth(socket);
        }).catch(err => {
            logger.error(err);
        });
    }

    onSocketDisconnected(socket, reason) {
        if(!socket) {
            return;
        }

        delete this.sockets[socket.id];

        if(!socket.user) {
            return;
        }

        delete this.users[socket.user.username];

        logger.info('user \'%s\' disconnected from the lobby: %s', socket.user.username, reason);

        var game = this.findGameForUser(socket.user.username);
        if(!game) {
            return;
        }

        game.disconnect(socket.user.username);

        if(game.isEmpty()) {
            delete this.games[game.id];
        } else {
            this.sendGameState(game);
        }

        this.broadcastGameList();
    }

    onNewGame(socket, gameDetails) {
        var existingGame = this.findGameForUser(socket.user.username);
        if(existingGame) {
            return;
        }

        if(gameDetails.quickJoin) {
            let sortedGames = _.sortBy(this.games, 'createdAt');
            let gameToJoin = sortedGames.find(game => !game.started && game.gameType === gameDetails.gameType && game.gameFormat === gameDetails.gameFormat && _.size(game.players) < 2 && !game.password);

            if(gameToJoin) {
                let message = gameToJoin.join(socket.id, socket.user.getDetails());
                if(message) {
                    socket.send('passworderror', message);

                    return;
                }

                socket.joinChannel(gameToJoin.id);

                this.sendGameState(gameToJoin);
                this.broadcastGameList();

                return;
            }
        }

        let game = new PendingGame(socket.user.getDetails(), gameDetails);
        game.newGame(socket.id, socket.user.getDetails(), gameDetails.password);

        socket.joinChannel(game.id);
        this.sendGameState(game);

        this.games[game.id] = game;
        this.broadcastGameList();
    }

    onJoinGame(socket, gameId, password) {
        var existingGame = this.findGameForUser(socket.user.username);
        if(existingGame) {
            return;
        }

        var game = this.games[gameId];
        if(!game) {
            return;
        }

        let message = game.join(socket.id, socket.user.getDetails(), password);
        if(message) {
            socket.send('passworderror', message);

            return;
        }

        socket.joinChannel(game.id);

        this.sendGameState(game);
        this.broadcastGameList();
    }

    onStartGame(socket, gameId) {
        var game = this.games[gameId];

        if(!game || game.started) {
            return;
        }

        if(_.any(game.getPlayers(), function (player) {
            return !player.deck;
        })) {
            return;
        }

        if(!game.isOwner(socket.user.username)) {
            return;
        }

        var gameNode = this.router.startGame(game);
        if(!gameNode) {
            return;
        }

        game.node = gameNode;
        game.started = true;

        this.broadcastGameList();

        _.each(game.getPlayersAndSpectators(), player => {
            let socket = this.sockets[player.id];

            if(!socket || !socket.user) {
                logger.error(`Wanted to handoff to ${player.name}, but couldn't find a socket`);
                return;
            }

            this.sendHandoff(socket, gameNode, game.id);
        });
    }

    sendHandoff(socket, gameNode, gameId) {
        let authToken = jwt.sign(socket.user.getWireSafeDetails(), this.config.secret, { expiresIn: '5m' });

        socket.send('handoff', {
            address: gameNode.address,
            port: gameNode.port,
            protocol: gameNode.protocol,
            name: gameNode.identity,
            authToken: authToken,
            gameId: gameId
        });
    }

    onWatchGame(socket, gameId, password) {
        var existingGame = this.findGameForUser(socket.user.username);
        if(existingGame) {
            return;
        }

        var game = this.games[gameId];
        if(!game) {
            return;
        }

        let message = game.watch(socket.id, socket.user.getDetails(), password);
        if(message) {
            socket.send('passworderror', message);

            return;
        }

        socket.joinChannel(game.id);

        if(game.started) {
            this.router.addSpectator(game, socket.user.getDetails());
            this.sendHandoff(socket, game.node, game.id);
        } else {
            this.sendGameState(game);
        }
    }

    onLeaveGame(socket) {
        var game = this.findGameForUser(socket.user.username);
        if(!game) {
            return;
        }

        game.leave(socket.user.username);
        socket.send('cleargamestate');
        socket.leaveChannel(game.id);

        if(game.isEmpty()) {
            delete this.games[game.id];
        } else {
            this.sendGameState(game);
        }

        this.broadcastGameList();
    }

    onPendingGameChat(socket, message) {
        var game = this.findGameForUser(socket.user.username);
        if(!game) {
            return;
        }

        game.chat(socket.user.username, message);
        this.sendGameState(game);
    }

    onLobbyChat(socket, message) {
        var chatMessage = { user: socket.user.getShortSummary(), message: message, time: new Date() };

        _.each(this.sockets, s => {
            if(s.user && _.contains(s.user.blockList, chatMessage.user.username.toLowerCase())) {
                return;
            }

            s.send('lobbychat', chatMessage);
        });

        this.messageService.addMessage(chatMessage);
    }

    onGetSealedDeck(socket, gameId) {
        let game = this.games[gameId];
        if(!game) {
            return;
        }

        Promise.all([this.cardService.getAllCards(), this.deckService.getSealedDeck()])
            .then(results => {
                let [cards, deckArray] = results;
                let deck = deckArray[0];

                _.each(deck.cards, card => {
                    card.card = cards[card.id];
                });
                deck.status = {
                    basicRules: true,
                    flagged: false,
                    verified: true,
                    noUnreleasedCards: true,
                    officialRole: true,
                    faqRestrictedList: true,
                    faqVersion: 'v1.0',
                    extendedStatus: []
                };

                game.selectDeck(socket.user.username, deck);

                this.sendGameState(game);
            })
            .catch(err => {
                logger.info(err);

                return;
            });
    }

    onSelectDeck(socket, gameId, deckId) {
        if(_.isObject(deckId)) {
            deckId = deckId._id;
        }

        var game = this.games[gameId];
        if(!game) {
            return;
        }

        Promise.all([this.cardService.getAllCards(), this.deckService.getById(deckId)])
            .then(results => {
                let [cards, deck] = results;

                _.each(deck.cards, card => {
                    card.card = cards[card.id];
                });
                deck.status = {
                    basicRules: true,
                    flagged: !!deck.flagged,
                    verified: !!deck.verified,
                    noUnreleasedCards: true,
                    officialRole: true,
                    faqRestrictedList: true,
                    faqVersion: 'v1.0',
                    extendedStatus: []
                };

                game.selectDeck(socket.user.username, deck);

                this.sendGameState(game);
            })
            .catch(err => {
                logger.info(err);

                return;
            });
    }

    onConnectFailed(socket) {
        var game = this.findGameForUser(socket.user.username);
        if(!game) {
            return;
        }

        logger.info('user \'%s\' failed to handoff to game server', socket.user.username);
        this.router.notifyFailedConnect(game, socket.user.username);
    }

    onRemoveGame(socket, gameId) {
        if(!socket.user.admin) {
            return;
        }

        var game = this.games[gameId];
        if(!game) {
            return;
        }

        logger.info(socket.user.username, 'closed game', game.id, '(' + game.name + ') forcefully');

        if(!game.started) {
            delete this.games[game.id];
        } else {
            this.router.closeGame(game);
        }
    }

    onGetNodeStatus(socket) {
        if(!socket.user.permissions.canManageNodes) {
            return;
        }

        socket.send('nodestatus', this.router.getNodeStatus());
    }

    onToggleNode(socket, node) {
        if(!socket.user.permissions.canManageNodes) {
            return;
        }

        this.router.toggleNode(node);

        socket.send('nodestatus', this.router.getNodeStatus());
    }

    onRestartNode(socket, node) {
        if(!socket.user.permissions.canManageNodes) {
            return;
        }

        this.router.restartNode(node);

        socket.send('nodestatus', this.router.getNodeStatus());
    }

    // router Events
    onGameClosed(gameId) {
        var game = this.games[gameId];

        if(!game) {
            return;
        }

        delete this.games[gameId];

        this.broadcastGameList();
    }

    onPlayerLeft(gameId, player) {
        var game = this.games[gameId];

        if(!game) {
            return;
        }

        game.leave(player);

        if(game.isEmpty()) {
            delete this.games[gameId];
        }

        this.broadcastGameList();
    }

    onWorkerTimedOut(nodeName) {
        this.clearGamesForNode(nodeName);
    }

    onWorkerStarted(nodeName) {
        Promise.all([this.cardService.getAllCards()])
            .then(results => {
                let [cards] = results;
                this.router.sendCommand(nodeName, 'CARDDATA', { ardData: cards });
            });
    }

    onClearSessions(socket, username) {
        this.userService.clearUserSessions(username).then(success => {
            if(!success) {
                logger.error(`Failed to clear sessions for user ${username}`, username);
                return;
            }

            let game = this.findGameForUser(username);

            if(game) {
                logger.info('closed game', game.id, '(' + game.name + ') forcefully due to clear session on', username);

                if(!game.started) {
                    delete this.games[game.id];
                } else {
                    this.router.closeGame(game);
                }
            }

            let socket = _.find(this.sockets, socket => {
                return socket.user && socket.user.username === username;
            });

            if(socket) {
                socket.disconnect();
            }
        });
    }

    onNodeReconnected(nodeName, games) {
        _.each(games, game => {
            let owner = game.players[game.owner];

            if(!owner) {
                logger.error('Got a game where the owner wasn\'t a player', game.owner);
                return;
            }

            let syncGame = new PendingGame({ username: owner.user }, { spectators: game.allowSpectators, name: game.name });
            syncGame.id = game.id;
            syncGame.node = this.router.workers[nodeName];
            syncGame.createdAt = game.startedAt;
            syncGame.started = game.started;
            syncGame.gameType = game.gameType;
            syncGame.password = game.password;

            _.each(game.players, player => {
                syncGame.players[player.name] = {
                    id: player.id,
                    name: player.name,
                    owner: game.owner === player.name,
                    faction: { cardData: { code: player.faction } },
                    user: player.user
                };
            });

            _.each(game.spectators, player => {
                syncGame.spectators[player.name] = {
                    id: player.id,
                    name: player.name,
                    user: player.user
                };
            });

            this.games[syncGame.id] = syncGame;
        });

        _.each(this.games, game => {
            if(game.node && game.node.identity === nodeName && _.find(games, nodeGame => {
                return nodeGame.id === game.id;
            })) {
                this.games[game.id] = game;
            } else if(game.node && game.node.identity === nodeName) {
                delete this.games[game.id];
            }
        });

        this.broadcastGameList();
    }
}

module.exports = Lobby;
