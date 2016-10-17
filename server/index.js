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
const uuid = require('node-uuid');
const _ = require('underscore');
const config = require('./config.js');

const isDeveloping = process.env.NODE_ENV !== 'production';
const port = isDeveloping ? 4000 : process.env.PORT;

const Game = require('./game/game.js');

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

                return done(null, { username: user.username, email: user.email, _id: user._id });
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

        done(err, { username: user.username, email: user.email, _id: user._id });
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
        app.use(express.static(__dirname + '/public'));
        app.get('*', function response(req, res) {
            res.sendFile(path.join(__dirname, 'public/index.html'));
        });
    }

    server.listen(port, '0.0.0.0', function onStart(err) {
        if(err) {
            logger.error(err);
        }

        logger.info('==> 🌎 Listening on port %s. Open up http://0.0.0.0:%s/ in your browser.', port, port);
    });
}

var games = [];
var gamesInProgress = {};

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

function findGame(gameid) {
    var game = _.find(games, function(g) {
        return g.id === gameid;
    });

    return game;
}

function findGameForPlayer(socketid) {
    return _.find(gamesInProgress, game => {
        return _.any(game.players, player => {
            return player.id === socketid.slice(2);
        });
    });
}

io.on('connection', function(socket) {
    socket.on('error', function(err) {
        logger.info('socket error', err);
    });

    socket.on('disconnect', function() {
        var playerGame = _.find(games, function(game) {
            return _.any(game.players, function(player) {
                return player.id === socket.id;
            });
        });

        if(!playerGame) {
            return;
        }

        var players = playerGame.players;

        playerGame.players = _.reject(playerGame.players, player => {
            return player.id === socket.id;
        });

        _.each(players, player => {
            if(socket.id === player.id) {
                _.each(players, sendPlayer => {
                    io.to(sendPlayer.id).emit('leavegame', playerGame, player);
                });
            }
        });

        if(_.isEmpty(playerGame.players)) {
            games = _.reject(games, game => {
                return game.id === playerGame.id;
            });
        }

        io.emit('games', games);
    });

    socket.on('authenticate', function(token) {
        jwt.verify(token, config.secret, function(err, user) {
            if(!err) {
                socket.request.user = user;
            }
        });
    });

    socket.on('newgame', function(game) {
        game.id = uuid.v1();
        game.started = false;
        game.players = [{
            id: socket.id,
            name: socket.request.user.username,
            owner: true
        }];

        games.push(game);
        socket.emit('newgame', game);
        io.emit('games', games);

        socket.join(game.id);
    });

    socket.on('joingame', function(gameid) {
        var game = findGame(gameid);

        if(!game || game.players.length === 2) {
            return;
        }

        game.players.push({
            id: socket.id,
            name: socket.request.user.username
        });

        socket.join(game.id);

        io.to(game.id).emit('joingame', game);

        io.emit('games', games);
    });

    socket.on('selectdeck', function(gameid, deck) {
        var game = findGame(gameid);

        if(!game) {
            return;
        }

        _.each(game.players, player => {
            if(socket.id === player.id) {
                player.deck = deck;
            }
        });

        io.to(game.id).emit('updategame', game);
    });

    socket.on('leavegame', function(gameid) {
        var game = findGame(gameid);

        if(!game) {
            return;
        }

        var leavingPlayer = undefined;

        game.players = _.reject(game.players, player => {
            if(player.id === socket.id) {
                leavingPlayer = player;
            }

            return player.id === socket.id;
        });

        socket.leave(game.id);

        io.to(game.id).emit('leavegame', game, leavingPlayer);

        if(_.isEmpty(game.players)) {
            games = _.reject(games, game => {
                return game.id === gameid;
            });
        }

        io.emit('games', games);
    });

    socket.on('startgame', function(gameid) {
        var game = findGame(gameid);

        if(!game) {
            return;
        }

        if(_.any(game.players, function(player) {
            return !player.deck;
        })) {
            return;
        }

        var isOwner = false;

        _.each(game.players, function(player) {
            if(player.id === socket.id && player.owner) {
                isOwner = true;
            }
        });

        if(!isOwner) {
            return;
        }

        game.started = true;

        var newGame = new Game(game);

        gamesInProgress[newGame.id] = newGame;

        newGame.initialise();

        io.to(game.id).emit('updategame', game);

        _.each(newGame.players, (player, key) => {
            io.to(key).emit('gamestate', newGame.getState(player.id));
        });

        socket.emit('games', games);
    });

    socket.on('mulligan', function() {
        var game = findGameForPlayer(socket.id);

        if(!game) {
            return;
        }

        game.mulligan(socket.id.slice(2));
        game.startGameIfAble();

        _.each(game.players, (player, key) => {
            io.to(key).emit('gamestate', game.getState(player.id));
        });
    });

    socket.on('keep', function() {
        var game = findGameForPlayer(socket.id);

        if(!game) {
            return;
        }

        game.keep(socket.id.slice(2));
        game.startGameIfAble();

        _.each(game.players, (player, key) => {
            io.to(key).emit('gamestate', game.getState(player.id));
        });
    });

    socket.on('playcard', function(card) {
        var game = findGameForPlayer(socket.id);

        if(!game) {
            return;
        }

        game.playCard(socket.id.slice(2), card);
        _.each(game.players, (player, key) => {
            io.to(key).emit('gamestate', game.getState(player.id));
        });
    });

    socket.on('setupdone', function() {
        var game = findGameForPlayer(socket.id);

        if(!game) {
            return;
        }

        game.setupDone(socket.id.slice(2));
        _.each(game.players, (player, key) => {
            io.to(key).emit('gamestate', game.getState(player.id));
        });
    });

    socket.on('selectplot', function(plot) {
        var game = findGameForPlayer(socket.id);

        if(!game) {
            return;
        }

        game.selectPlot(socket.id.slice(2), plot);
        _.each(game.players, (player, key) => {
            io.to(key).emit('gamestate', game.getState(player.id));
        });
    });

    socket.on('firstplayer', function(arg) {
        var game = findGameForPlayer(socket.id);

        if(!game) {
            return;
        }

        game.setFirstPlayer(socket.id.slice(2), arg);
        _.each(game.players, (player, key) => {
            io.to(key).emit('gamestate', game.getState(player.id));
        });
    });

    socket.on('cardclick', function(card) {
        var game = findGameForPlayer(socket.id);

        if(!game) {
            return;
        }

        game.cardClicked(socket.id.slice(2), card);

        socket.emit('gamestate', game.getState(socket.id.slice(2)));
    });

    socket.on('showdrawdeck', function() {
        var game = findGameForPlayer(socket.id);

        if(!game) {
            return;
        }

        game.showDrawDeck(socket.id.slice(2));

        socket.emit('gamestate', game.getState(socket.id.slice(2)));
    });

    socket.on('handdrop', function(card) {
        var game = findGameForPlayer(socket.id);

        if(!game) {
            return;
        }

        game.handDrop(socket.id.slice(2), card);

        socket.emit('gamestate', game.getState(socket.id.slice(2)));
    });

    socket.on('donemarshal', function() {
        var game = findGameForPlayer(socket.id);

        if(!game) {
            return;
        }

        game.marshalDone(socket.id.slice(2));

        _.each(game.players, (player, key) => {
            io.to(key).emit('gamestate', game.getState(player.id));
        });
    });

    socket.on('military', function() {
        var game = findGameForPlayer(socket.id);

        if(!game) {
            return;
        }

        game.startMilitary(socket.id.slice(2));

        _.each(game.players, (player, key) => {
            io.to(key).emit('gamestate', game.getState(player.id));
        });
    });

    socket.on('donechallenge', function() {
        var game = findGameForPlayer(socket.id);

        if(!game) {
            return;
        }

        game.doneChallenge(socket.id.slice(2));

        _.each(game.players, (player, key) => {
            io.to(key).emit('gamestate', game.getState(player.id));
        });
    });

    socket.emit('games', games);
});

module.exports = runServer;
