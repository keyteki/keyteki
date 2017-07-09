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
const CardService = require('./repositories/cardService.js');
const validateDeck = require('../client/deck-validator.js'); // XXX Move this to a common location

class Lobby {
    constructor(server, options = {}) {
        this.sockets = {};
        this.users = {};
        this.games = {};
        this.config = options.config;
        this.messageRepository = options.messageRepository || new MessageRepository(this.config.dbPath);
        this.deckRepository = options.deckRepository || new DeckRepository(this.config.dbPath);
        this.cardService = options.cardService || new CardService({ dbPath: this.config.dbPath });
        this.router = options.router || new GameRouter(this.config);

        this.router.on('onGameClosed', this.onGameClosed.bind(this));
        this.router.on('onPlayerLeft', this.onPlayerLeft.bind(this));
        this.router.on('onWorkerTimedOut', this.onWorkerTimedOut.bind(this));
        this.router.on('onNodeReconnected', this.onNodeReconnected.bind(this));

        this.io = options.io || socketio(server, { perMessageDeflate: false });
        this.io.set('heartbeat timeout', 30000);
        this.io.use(this.handshake.bind(this));
        this.io.on('connection', this.onConnection.bind(this));

        this.lastUserBroadcast = moment();
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
        let userList = _.map(this.users, function(user) {
            return {
                name: user.username,
                emailHash: user.emailHash,
                noAvatar: user.settings ? user.settings.disableGravatar : false
            };
        });

        userList = _.sortBy(userList, user => {
            return user.name.toLowerCase();
        });

        return userList;
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
        var now = moment();

        if((now - this.lastUserBroadcast) / 1000 < 60) {
            return;
        }

        this.lastUserBroadcast = moment();

        this.broadcastMessage('users', this.getUserList());
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
        socket.registerEvent('connectfailed', this.onConnectFailed.bind(this));
        socket.registerEvent('removegame', this.onRemoveGame.bind(this));

        socket.on('authenticate', this.onAuthenticated.bind(this));
        socket.on('disconnect', this.onSocketDisconnected.bind(this));

        this.sockets[ioSocket.id] = socket;

        if(socket.user) {
            this.users[socket.user.username] = socket.user;

            this.broadcastUserList();
        }

        socket.send('users', this.getUserList());

        this.messageRepository.getLastMessages((err, messages) => {
            if(err) {
                return;
            }

            socket.send('lobbymessages', messages.reverse());
        });

        this.broadcastGameList(socket);

        if(!socket.user) {
            return;
        }

        var game = this.findGameForUser(socket.user.username);
        if(game && game.started) {
            socket.send('handoff', { address: game.node.address, port: game.node.port, protocol: game.node.protocol, name: game.node.identity });
        }
    }

    onAuthenticated(user) {
        this.users[user.username] = user;

        this.broadcastUserList();
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

        var game = new PendingGame(socket.user, gameDetails);
        game.newGame(socket.id, socket.user, gameDetails.password, (err, message) => {
            if(err) {
                logger.info('game failed to create', err, message);

                return;
            }

            socket.joinChannel(game.id);
            this.sendGameState(game);

            this.games[game.id] = game;
            this.broadcastGameList();
        });
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

        game.join(socket.id, socket.user, password, (err, message) => {
            if(err) {
                socket.send('passworderror', message);

                return;
            }

            socket.joinChannel(game.id);

            this.sendGameState(game);

            this.broadcastGameList();
        });
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

        this.io.to(game.id).emit('handoff', { address: gameNode.address, port: gameNode.port, protocol: game.node.protocol, name: game.node.identity });
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

        game.watch(socket.id, socket.user, password, (err, message) => {
            if(err) {
                socket.send('passworderror', message);

                return;
            }

            socket.joinChannel(game.id);

            if(game.started) {
                this.router.addSpectator(game, socket.user);
                socket.send('handoff', { address: game.node.address, port: game.node.port, protocol: game.node.protocol, name: game.node.identity });
            } else {
                this.sendGameState(game);
            }
        });
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
        var chatMessage = { user: { username: socket.user.username, emailHash: socket.user.emailHash, noAvatar: socket.user.settings ? socket.user.settings.disableGravatar : false }, message: message, time: new Date() };

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

        let cards = {};
        let packs = {};

        this.cardService.getAllCards()
            .then(result => {
                cards = result;

                return this.cardService.getAllPacks();
            })
            .then(result => {
                packs = result;

                this.deckRepository.getById(deckId, (err, deck) => {

                    _.each(deck.plotCards, plot => {
                        plot.card = cards[plot.card.code];
                    });

                    _.each(deck.drawCards, draw => {
                        draw.card = cards[draw.card.code];
                    });

                    if(deck.agenda) {
                        deck.agenda = cards[deck.agenda.code];
                    }

                    let validation = validateDeck(deck, packs);
                    deck.status = validation.status;

                    game.selectDeck(socket.user.username, deck);

                    this.sendGameState(game);
                });
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

    onNodeReconnected(nodeName, games) {
        _.each(games, game => {
            var syncGame = new PendingGame({ username: game.owner }, {spectators: game.allowSpectators, name: game.name});
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
                    emailHash: player.emailHash,
                    owner: game.owner === player.name,
                    faction: { cardData: { code: player.faction } },
                    agenda: { cardData: { code: player.agenda } }
                };
            });

            _.each(game.spectators, player => {
                syncGame.spectators[player.name] = {
                    id: player.id,
                    name: player.name,
                    emailHash: player.emailHash
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
