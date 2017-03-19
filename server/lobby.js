const socketio = require('socket.io');
const Socket = require('./socket.js');
const jwt = require('jsonwebtoken');
const _ = require('underscore');
const moment = require('moment');

const logger = require('./log.js');
const version = moment(require('../version.js'));
const PendingGame = require('./pendinggame.js');
const GameRouter = require('./gamerouter.js');
const MessageRepository = require('./repositories/messageRepository.js');
const DeckRepository = require('./repositories/deckRepository.js');

class Lobby {
    constructor(server, options = {}) {
        this.sockets = {};
        this.users = {};
        this.games = {};
        this.config = options.config;
        this.messageRepository = options.messageRepository || new MessageRepository(this.config.dbPath);
        this.deckRepository = options.deckRepository || new DeckRepository(this.config.dbPath);
        this.router = options.router || new GameRouter(this.config);
        this.router.on('onGameClosed', this.onGameClosed.bind(this));
        this.router.on('onPlayerLeft', this.onPlayerLeft.bind(this));
        this.router.on('onWorkerStarted', this.onWorkerStarted.bind(this));
        this.router.on('onWorkerTimedOut', this.onWorkerTimedOut.bind(this));

        this.io = options.io || socketio(server);
        this.io.set('heartbeat timeout', 30000);
        this.io.use(this.handshake.bind(this));
        this.io.on('connection', this.onConnection.bind(this));
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
                node: game.node ? game.node.identity : 'None'
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
        return _.find(this.games, game => game.hasActivePlayer(user));
    }

    handshake(socket, next) {
        var versionInfo = undefined;

        if(socket.handshake.query.token && socket.handshake.query.token !== 'undefined') {
            jwt.verify(socket.handshake.query.token, this.config.secret, function(err, user) {
                if(err) {
                    logger.info(err);
                    return;
                }

                socket.request.user = user;
            });
        }

        if(socket.handshake.query.version) {
            versionInfo = moment(socket.handshake.query.version);
        }

        if(!versionInfo || versionInfo < version) {
            socket.emit('banner', 'Your client version is out of date, please refresh or clear your cache to get the latest version');
        }

        next();
    }

    // Actions
    broadcastMessage(message, ...params) {
        this.io.emit(message, ...params);
    }

    broadcastGameList(socket) {
        var gameSummaries = [];

        _.each(this.games, game => {
            gameSummaries.push(game.getSummary());
        });

        gameSummaries = _.sortBy(gameSummaries, 'createdAt').reverse();

        if(socket) {
            socket.send('games', gameSummaries);
        } else {
            this.broadcastMessage('games', gameSummaries);
        }
    }

    broadcastUserList() {
        var userList = _.map(this.users, function(user) {
            return {
                name: user.username,
                emailHash: user.emailHash
            };
        });

        userList = _.sortBy(userList, 'name');

        this.broadcastMessage('users', userList);
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

        socket.on('authenticate', this.onAuthenticated.bind(this));
        socket.on('disconnect', this.onSocketDisconnected.bind(this));

        this.sockets[ioSocket.id] = socket;

        if(socket.user) {
            this.users[socket.user.username] = socket.user;
            this.broadcastUserList();
        }

        this.messageRepository.getLastMessages().then(messages => {
            socket.send('lobbymessages', messages.reverse());
        }).catch(err => {
            logger.info(err);
        });

        this.broadcastGameList();

        if(!socket.user) {
            return;
        }

        var game = this.findGameForUser(socket.user.username);
        if(game && game.started) {
            socket.send('handoff', { address: game.node.address, port: game.node.port, protocol: game.node.protocol });
        }
    }

    onAuthenticated(user) {
        this.users[user.username] = user;

        this.broadcastUserList();
    }

    onSocketDisconnected(socket) {
        if(!socket) {
            return;
        }

        if(!socket.user) {
            delete this.sockets[socket.id];
            return;
        }

        delete this.users[socket.user.username];

        var game = this.findGameForUser(socket.user.username);
        if(!game) {
            return;
        }

        game.disconnect(socket.user.username);
        socket.send('gamestate', game.getSummary(socket.user.username));
        socket.leaveChannel(game.id);

        if(game.isEmpty()) {
            delete this.games[game.id];
        } else {
            this.sendGameState(game);
        }

        delete this.sockets[socket.id];

        this.broadcastGameList();
    }

    onNewGame(socket, gameDetails) {
        var existingGame = this.findGameForUser(socket.user.username);
        if(existingGame) {
            return;
        }

        var game = new PendingGame(socket.user, gameDetails);
        game.join(socket.id, socket.user);

        socket.joinChannel(game.id);
        this.sendGameState(game);

        this.games[game.id] = game;

        this.broadcastGameList();
    }

    onJoinGame(socket, gameId) {
        var existingGame = this.findGameForUser(socket.user.username);
        if(existingGame) {
            return;
        }

        var game = this.games[gameId];
        if(!game) {
            return;
        }

        if(game.join(socket.id, socket.user)) {
            socket.joinChannel(game.id);

            this.sendGameState(game);
        }

        this.broadcastGameList();
    }

    onStartGame(socket, gameId) {
        var game = this.games[gameId];

        if(!game || game.started) {
            return;
        }

        if(_.any(game.getPlayers(), function(player) {
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

        this.io.to(game.id).emit('handoff', { address: gameNode.address, port: gameNode.port, protocol: game.node.protocol });
    }

    onWatchGame(socket, gameId) {
        var existingGame = this.findGameForUser(socket.user.username);
        if(existingGame) {
            return;
        }

        var game = this.games[gameId];
        if(!game) {
            return;
        }

        if(game.watch(socket.id, socket.user)) {
            socket.joinChannel(game.id);

            if(game.started) {
                this.router.addSpectator(game, socket.user);
                socket.send('handoff', { address: game.node.address, port: game.node.port, protocol: game.node.protocol });
            } else {
                this.sendGameState(game);
            }
        }
    }

    onLeaveGame(socket) {
        var game = this.findGameForUser(socket.user.username);
        if(!game) {
            return;
        }

        game.leave(socket.user.username);
        socket.send('gamestate', game.getSummary(socket.user.username));
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
        var chatMessage = { user: { username: socket.user.username, emailHash: socket.user.emailHash }, message: message, time: new Date() };

        this.messageRepository.addMessage(chatMessage);
        this.broadcastMessage('lobbychat', chatMessage);
    }

    onSelectDeck(socket, gameId, deckId) {
        if(_.isObject(deckId)) {
            deckId = deckId._id;
        }

        var game = this.games[gameId];
        if(!game) {
            return;
        }

        this.deckRepository.getById(deckId).then(deck => {
            game.selectDeck(socket.user.username, deck);

            this.sendGameState(game);
        }).catch(err => {
            logger.info(err);
        });
    }

    // router Events
    onGameClosed(gameId) {
        var game = this.games[gameId];

        if(!game) {
            return;
        }

        game.node.numGames--;

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

    onWorkerStarted(nodeName) {
        // If any games are already active on a worker with this name, then the
        // worker was probably restarted and those games are gone.
        this.clearGamesForNode(nodeName);
    }

    onWorkerTimedOut(nodeName) {
        this.clearGamesForNode(nodeName);
    }
}

module.exports = Lobby;
