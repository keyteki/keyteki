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
const raven = require('raven');

const isDeveloping = process.env.NODE_ENV !== 'production';
const port = isDeveloping ? 4000 : process.env.PORT;

const Game = require('./game/game.js');
const Player = require('./game/player.js');
const Spectator = require('./game/spectator.js');
const escapeRegex = require('./util.js').escapeRegex;

var ravenClient = new raven.Client(config.sentryDsn);
ravenClient.patchGlobal();

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
        db.collection('users').findOne({ username: { '$regex': new RegExp('^' + escapeRegex(username.toLowerCase()), 'i')}},
        function(err, user) {
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
        app.set('views', path.join(__dirname, '..', 'views'));
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

function refreshUserList(socket) {
    var userList = _.map(users, function(user) {
        return {
            name: user.username,
            emailHash: user.emailHash
        };
    });

    if(socket) {
        socket.emit('users', userList);
    } else {
        io.emit('users', userList);
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
    game.playerLeave(socket.request.user.username, reason);

    if(game.started) {
        _.each(game.players, player => {
            io.to(player.id).emit('gamestate', game.getState(player.name));
        });
    }

    var player = game.players[socket.request.user.username];

    if(!player) {
        return;
    }

    if(game.isSpectator(player)) {
        delete game.players[socket.request.user.username];
    } else {
        game.players[socket.request.user.username].left = true;
    }

    io.to(game.id).emit('leavegame', game.getSummary(socket.request.user.username), player.name);

    socket.leave(game.id);

    var listToCheck = game.getPlayers();

    if(_.all(listToCheck, p => {
        return !!p.left;
    }) && _.isEmpty(game.getSpectators())) {
        delete games[game.id];
    }
}

function sendGameState(game) {
    _.each(game.players, player => {
        io.to(player.id).emit('gamestate', game.getState(player.name));
    });
}

function handleError(game, e) {
    logger.error(e);

    var debugData = {};

    debugData.game = game.getState();

    _.each(game.getPlayers(), player => {
        debugData[player.name] = player.getState(player.name);
    });

    if(!isDeveloping) {
        ravenClient.captureException(e, { extra: debugData });
    }

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

var users = {};

io.on('connection', function(socket) {
    if(socket.request.user) {
        var game = findGameForPlayer(socket.request.user.username);

        if(game) {
            runAndCatchErrors(game, () => {
                if(!game.players[socket.request.user.username].noReconnect) {
                    game.reconnect(socket.id, socket.request.user.username);        

                    sendGameState(game);
                }
            });
        }
    }

    socket.on('error', function(err) {
        logger.info('socket error', err);
    });

    socket.on('disconnect', function() {
        if(!socket.request.user) {
            return;
        }

        var game = findGameForPlayer(socket.request.user.username);

        delete users[socket.request.user.username];

        refreshUserList();

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
                users[user.username] = user;

                refreshUserList();
            }
        });
    });

    socket.on('newgame', function(gameDetails) {
        if(!socket.request.user) {
            return;
        }

        var game = new Game(socket.request.user.username, gameDetails);

        game.players[socket.request.user.username] = new Player(socket.id, socket.request.user, true, game);

        games[game.id] = game;
        socket.emit('newgame', game.getState(socket.request.user.username));
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
            game.players[socket.request.user.username] = new Player(socket.id, socket.request.user, false, game);
            socket.join(game.id);
        });

        _.each(game.players, player => {
            io.to(player.id).emit('joingame', game.getState(player.name));
        });

        refreshGameList();
    });

    socket.on('watchgame', function(gameid) {
        if(!socket.request.user) {
            return;
        }

        var game = games[gameid];

        if(!game || !game.allowSpectators) {
            return;
        }

        runAndCatchErrors(game, () => {
            game.players[socket.request.user.username] = new Spectator(socket.id, socket.request.user);
            game.addMessage('{0} has joined the game as a spectator', socket.request.user.username);
            socket.join(game.id);
            _.each(game.players, player => {
                io.to(player.id).emit('joingame', game.getState(player.name));
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
            game.selectDeck(socket.request.user.username, deck);
        });

        sendGameState(game);
    });

    socket.on('leavegame', function(gameid) {
        if(!socket.request.user) {
            return;
        }

        var game = gameid ? games[gameid] : findGameForPlayer(socket.request.user.username);
        if(!game) {
            return;
        }

        game.players[socket.request.user.username].noReconnect = true;

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

        var player = game.getPlayerByName(socket.request.user.username);
        if(!player || !player.owner) {
            return;
        }

        runAndCatchErrors(game, () => {
            game.started = true;

            game.initialise();
            sendGameState(game);

            refreshGameList();
        });
    });

    socket.on('game', function(command, ...args) {
        if(!socket.request.user) {
            return;
        }

        var game = findGameForPlayer(socket.request.user.username);

        if(!game || (!game.playStarted && command !== 'chat') || !game[command] || !_.isFunction(game[command])) {
            return;
        }

        runAndCatchErrors(game, () => {
            game[command](socket.request.user.username, ...args);

            game.continue();

            sendGameState(game);
        });
    });

    socket.on('lobbychat', function(message) {
        if(!socket.request.user) {
            return;
        }

        var chatMessage = { user: { username: socket.request.user.username, emailHash: socket.request.user.emailHash }, message: message, time: new Date() };
        db.collection('messages').insert(chatMessage);
        io.emit('lobbychat', chatMessage);
    });

    refreshGameList(socket);

    if(socket.request.user) {
        users[socket.request.user.username] = socket.request.user;
    }

    refreshUserList();

    db.collection('messages').find().sort({ time: -1 }).limit(50).toArray((err, messages) => {
        if(err) {
            logger.info(err);
            return;
        }

        socket.emit('lobbymessages', messages.reverse());
    });
});

module.exports = runServer;
