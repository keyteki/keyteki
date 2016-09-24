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

io.on('connection', function(socket) {
    socket.on('error', function(err) {
        logger.info('socket error', err);
    });

    socket.on('disconnect', function() {
        games = _.reject(games, function(game) {
            return (game.player1 && game.player1.id === socket.id) || (game.player2 && game.player2.id === socket.id);
        });

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
        game.player1 = {
            id: socket.id,
            name: socket.request.user.username
        };

        games.push(game);
        socket.emit('newgame', game);
        io.emit('games', games);
    });

    socket.on('joingame', function(gameid) {
        var game = findGame(gameid);

        if(!game) {
            return;
        }

        game.player2 = {
            id: socket.id,
            name: socket.request.user.username
        };

        socket.emit('joingame', game);
        io.to(game.player1.id).emit('joingame', game);
        io.emit('games', games);
    });

    socket.on('selectdeck', function(gameid, deck) {
        var game = findGame(gameid);

        if(!game) {
            return;
        }

        if(socket.id === game.player1.id) {
            game.player1.deck = deck;
        }

        if(game.player2 && socket.id === game.player2.id) {
            game.player2.deck = deck;
        }

        io.to(game.player1.id).emit('updategame', game);
        if(game.player2) {
            io.to(game.player2.id).emit('updategame', game);
        }
    });

    socket.emit('games', games);
});

module.exports = runServer;
