const path = require('path');
const express = require('express');
const app = require('express')();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const webpack = require('webpack');
const webpackMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const webpackConfig = require('../webpack.config.js');
const api = require('./api');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const logger = require('./log.js');
const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const mongoskin = require('mongoskin');
const db = mongoskin.db('mongodb://127.0.0.1:27017/throneteki');
const pug = require('pug');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const _ = require('underscore');
const config = require('./config.js');
const crypto = require('crypto');

const isDeveloping = process.env.NODE_ENV !== 'production';
const port = isDeveloping ? 4000 : process.env.PORT;

const Game = require('./game/game.js');
const Player = require('./game/player.js');
const Spectator = require('./game/spectator.js');

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(session({
    store: new MongoStore({ url: 'mongodb://127.0.0.1:27017/throneteki' }),
    saveUninitialized: false,
    resave: false,
    secret: config.secret,
    cookie: { maxAge: 1000 * 60 * 60 * 24 * 7 } // 7 days
}));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new localStrategy(
    function(username, password, done) {
        db.collection('users').findOne({ username: username }, function(err, user) {
            if(err) {
                return done(err);
            }

            if(!user) {
                return done(null, false, { message: 'Invalid username/password' });
            }

            bcrypt.compare(password, user.password, function(err, valid) {
                if(err) {
                    return done(err);
                }

                if(!valid) {
                    return done(null, false, { message: 'Invalid username/password' });
                }

                return done(null, { username: user.username, email: user.email, emailHash: user.emailHash, _id: user._id });
            });
        });
    }
));

passport.serializeUser(function(user, done) {
    if(user) {
        done(null, user._id);
    }
});

passport.deserializeUser(function(id, done) {
    db.collection('users').findById(id, function(err, user) {
        if(err) {
            logger.info(err);
        }

        if(!user) {
            return;
        }

        if(!user.emailHash) {
            user.emailHash = crypto.createHash('md5').update(user.email).digest('hex');

            db.collection('users').update({ username: user.username }, 
                {
                    '$set': {
                        emailHash: user.emailHash
                    }
                });
        }

        done(err, { username: user.username, email: user.email, emailHash: user.emailHash, _id: user._id });
    });
});

api.init(app);

function runServer() {
    if(isDeveloping) {
        const compiler = webpack(webpackConfig);
        const middleware = webpackMiddleware(compiler, {
            hot: true,
            contentBase: 'client',
            publicPath: webpackConfig.output.publicPath,
            stats: {
                colors: true,
                hash: false,
                timings: true,
                chunks: false,
                chunkModules: false,
                modules: false
            },
            historyApiFallback: true
        });

        app.use(middleware);
        app.use(webpackHotMiddleware(compiler, {
            log: logger.info,
            heartbeat: 10 * 1000
        }));
        app.use(express.static(__dirname + '/../public'));
        app.get('*', function response(req, res) {
            var token = undefined;

            if(req.user) {
                token = jwt.sign(req.user, config.secret);
            }

            var html = pug.renderFile('views/index.pug', { basedir: path.join(__dirname, '..', 'views'), user: req.user, token: token });
            middleware.fileSystem.writeFileSync(path.join(__dirname, '..', 'public/index.html'), html);
            res.write(middleware.fileSystem.readFileSync(path.join(__dirname, '..', 'public/index.html')));
            res.end();
        });
    } else {
        app.use(express.static(__dirname + '/../public'));
        app.set('view engine', 'pug');
        app.get('*', function response(req, res) {
            var token = undefined;

            if(req.user) {
                token = jwt.sign(req.user, config.secret);
            }

            res.render('index', { basedir: path.join(__dirname, '..', 'views'), user: req.user, token: token, production: true });
        });
    }

    server.listen(port, '0.0.0.0', function onStart(err) {
        if(err) {
            logger.error(err);
        }

        logger.info('==> 🌎 Listening on port %s. Open up http://0.0.0.0:%s/ in your browser.', port, port);
    });
}

var games = {};

io.set('heartbeat timeout', 30000);

io.use(function(socket, next) {
    if(socket.handshake.query.token) {
        jwt.verify(socket.handshake.query.token, config.secret, function(err, user) {
            if(!err) {
                socket.request.user = user;
            }
        });
    }

    next();
});

function refreshGameList(socket) {
    var gameSummaries = [];

    _.each(games, game => {
        gameSummaries.push(game.getSummary());
    });

    if(socket) {
        socket.emit('games', gameSummaries);
    } else {
        io.emit('games', gameSummaries);
    }
}

function findGameForPlayer(socketid) {
    var gameToReturn = undefined;
    _.each(games, game => {
        if(game.players[socketid]) {
            gameToReturn = game;
        }

        if(gameToReturn) {
            return;
        }
    });

    return gameToReturn;
}

function removePlayerFromGame(game, socket, reason) {
    game.playerLeave(socket.id, reason);

    if(game.started) {
        _.each(game.players, (player, key) => {
            io.to(key).emit('gamestate', game.getState(player.id));
        });
    }

    var player = game.players[socket.id];

    if(!player) {
        return;
    }

    delete game.players[socket.id];

    io.to(game.id).emit('leavegame', game.getSummary(socket.id), player.id);

    socket.leave(game.id);

    var listToCheck = game.getPlayers();

    if(_.isEmpty(listToCheck)) {
        delete games[game.id];
    }
}

function updateGame(game) {
    _.each(game.players, (player, key) => {
        io.to(key).emit('updategame', game.getState(player.id));
    });
}

function sendGameState(game) {
    _.each(game.players, (player, key) => {
        io.to(key).emit('gamestate', game.getState(player.id));
    });
}

function handleError(game, e) {
    logger.error(e);
    _.each(game.players, player => {
        logger.error(game.getSummary(player.id));
    });

    if(game) {
        game.addMessage('A Server error has occured processing your game state, apologies.  Your game may now be in an inconsistent state, or you may be able to continue.  The error has been logged.');
    }
}

function runAndCatchErrors(game, func) {
    try {
        func();
    } catch(e) {
        handleError(game, e);

        sendGameState(game);
    }
}

io.on('connection', function(socket) {
    socket.on('error', function(err) {
        logger.info('socket error', err);
    });

    socket.on('disconnect', function() {
        var game = findGameForPlayer(socket.id);

        if(!game) {
            return;
        }

        removePlayerFromGame(game, socket, 'has disconnected');

        refreshGameList();
    });

    socket.on('authenticate', function(token) {
        jwt.verify(token, config.secret, function(err, user) {
            if(!err) {
                socket.request.user = user;
            }
        });
    });

    socket.on('newgame', function(name) {
        if(!socket.request.user) {
            return;
        }

        var game = new Game(socket.id, name);

        game.players[socket.id] = new Player(socket.id, socket.request.user, true, game);

        games[game.id] = game;
        socket.emit('newgame', game.getState(socket.id));
        socket.join(game.id);

        refreshGameList();
    });

    socket.on('joingame', function(gameid) {
        if(!socket.request.user) {
            return;
        }

        var game = games[gameid];

        if(!game || game.started || game.getPlayers().length === 2) {
            return;
        }

        runAndCatchErrors(game, () => {
            game.players[socket.id] = new Player(socket.id, socket.request.user, false, game);
            socket.join(game.id);
        });

        _.each(game.players, (player, key) => {
            io.to(key).emit('joingame', game.getState(player.id));
        });

        refreshGameList();
    });

    socket.on('watchgame', function(gameid) {
        if(!socket.request.user) {
            return;
        }

        var game = games[gameid];

        if(!game) {
            return;
        }

        runAndCatchErrors(game, () => {
            game.players[socket.id] = new Spectator(socket.id, socket.request.user);
            game.addMessage('{0} has joined the game as a spectator', socket.request.user.username);
            socket.join(game.id);
            _.each(game.players, (player, key) => {
                io.to(key).emit('joingame', game.getState(player.id));
            });

            sendGameState(game);
        });
    });

    socket.on('selectdeck', function(gameid, deck) {
        if(!socket.request.user) {
            return;
        }

        var game = games[gameid];

        if(!game) {
            return;
        }

        runAndCatchErrors(game, () => {
            game.selectDeck(socket.id, deck);
        });

        updateGame(game);
    });

    socket.on('leavegame', function(gameid) {
        if(!socket.request.user) {
            return;
        }

        var game = gameid ? games[gameid] : findGameForPlayer(socket.id);
        if(!game) {
            return;
        }

        runAndCatchErrors(game, () => {
            removePlayerFromGame(game, socket, 'has left the game');
        });

        refreshGameList();
    });

    socket.on('startgame', function(gameid) {
        if(!socket.request.user) {
            return;
        }

        var game = games[gameid];

        if(!game || game.started) {
            return;
        }

        if(_.any(game.getPlayers(), function(player) {
            return !player.deck;
        })) {
            return;
        }

        var player = game.getPlayerById(socket.id);
        if(!player || !player.owner) {
            return;
        }

        runAndCatchErrors(game, () => {
            game.started = true;

            game.initialise();
            updateGame(game);
            sendGameState(game);

            refreshGameList();
        });
    });

    socket.on('cardclick', function(source, cardId) {
        var game = findGameForPlayer(socket.id);

        if(!game) {
            return;
        }

        runAndCatchErrors(game, () => {
            game.cardClicked(socket.id, source, cardId);

            sendGameState(game);
        });
    });

    socket.on('showdrawdeck', function() {
        var game = findGameForPlayer(socket.id);

        if(!game) {
            return;
        }

        runAndCatchErrors(game, () => {
            game.showDrawDeck(socket.id);

            sendGameState(game);
        });
    });

    socket.on('drop', function(card, source, target) {
        var game = findGameForPlayer(socket.id);

        if(!game) {
            return;
        }

        runAndCatchErrors(game, () => {
            game.drop(socket.id, card, source, target);

            sendGameState(game);
        });
    });

    socket.on('challenge', function(challengeType) {
        var game = findGameForPlayer(socket.id);

        if(!game) {
            return;
        }

        runAndCatchErrors(game, () => {
            game.startChallenge(socket.id, challengeType);

            sendGameState(game);
        });

    });

    socket.on('donechallenge', function() {
        var game = findGameForPlayer(socket.id);

        if(!game) {
            return;
        }

        runAndCatchErrors(game, () => {
            game.doneChallenge(socket.id);

            sendGameState(game);
        });

    });

    socket.on('donedefend', function() {
        var game = findGameForPlayer(socket.id);

        if(!game) {
            return;
        }

        runAndCatchErrors(game, () => {
            game.doneDefend(socket.id);

            sendGameState(game);
        });
    });

    socket.on('doneallchallenges', function() {
        var game = findGameForPlayer(socket.id);

        if(!game) {
            return;
        }

        runAndCatchErrors(game, () => {
            game.doneChallenges(socket.id);

            sendGameState(game);
        });
    });

    socket.on('changestat', function(stat, value) {
        var game = findGameForPlayer(socket.id);

        if(!game) {
            return;
        }

        runAndCatchErrors(game, () => {
            game.changeStat(socket.id, stat, value);

            sendGameState(game);
        });
    });

    socket.on('menuButton', function(arg, method) {
        var game = findGameForPlayer(socket.id);

        if(!game) {
            return;
        }

        runAndCatchErrors(game, () => {
            game.menuButton(socket.id, arg, method);

            sendGameState(game);
        });
    });

    socket.on('chat', function(message) {
        var game = findGameForPlayer(socket.id);

        if(!game) {
            return;
        }

        runAndCatchErrors(game, () => {
            game.chat(socket.id, message);

            if(game.started) {
                sendGameState(game);
            } else {
                updateGame(game);
            }
        });
    });

    socket.on('lobbychat', function(message) {
        if(!socket.request.user) {
            return;
        }

        var chatMessage = { user: { username: socket.request.user.username }, message: message, time: new Date() };
        db.collection('messages').insert(chatMessage);
        io.emit('lobbychat', chatMessage);
    });

    socket.on('concede', function() {
        var game = findGameForPlayer(socket.id);

        if(!game) {
            return;
        }

        runAndCatchErrors(game, () => {
            game.concede(socket.id);
        });

        sendGameState(game);
    });

    socket.on('donestealth', function() {
        var game = findGameForPlayer(socket.id);

        if(!game) {
            return;
        }

        runAndCatchErrors(game, () => {
            game.doneStealth(socket.id);
        });

        sendGameState(game);
    });

    socket.on('donesetpower', function() {
        var game = findGameForPlayer(socket.id);

        if(!game) {
            return;
        }

        runAndCatchErrors(game, () => {
            game.doneSetPower(socket.id);
        });

        sendGameState(game);
    });

    socket.on('donesetstrength', function() {
        var game = findGameForPlayer(socket.id);

        if(!game) {
            return;
        }

        runAndCatchErrors(game, () => {
            game.doneSetStrength(socket.id);
        });

        sendGameState(game);
    });

    socket.on('shuffledeck', function() {
        var game = findGameForPlayer(socket.id);

        if(!game) {
            return;
        }

        runAndCatchErrors(game, () => {
            game.shuffleDeck(socket.id);

            sendGameState(game);
        });
    });

    socket.on('plot', function(arg, method) {
        var game = findGameForPlayer(socket.id);

        if(!game) {
            return;
        }

        runAndCatchErrors(game, () => {
            game.plotCardCommand(socket.id, method, arg);

            sendGameState(game);
        });
    });

    socket.on('agenda', function(arg, method) {
        var game = findGameForPlayer(socket.id);

        if(!game) {
            return;
        }

        runAndCatchErrors(game, () => {
            game.agendaCardCommand(socket.id, method, arg);

            sendGameState(game);
        });
    });

    socket.on('discardclick', function(cardId) {
        var game = findGameForPlayer(socket.id);

        if(!game) {
            return;
        }

        runAndCatchErrors(game, () => {
            game.discardCardClicked(socket.id, cardId);

            sendGameState(game);
        });
    });

    refreshGameList(socket);

    db.collection('messages').find().sort({ time: -1 }).limit(50).toArray((err, messages) => {
        if(err) {
            logger.info(err);
            return;
        }

        socket.emit('lobbymessages', messages.reverse());
    });
});

module.exports = runServer;
