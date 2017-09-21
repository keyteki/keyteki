const _ = require('underscore');
const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const config = require('config');
const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const logger = require('./log.js');
const bcrypt = require('bcryptjs');
const api = require('./api');
const path = require('path');
const jwt = require('jsonwebtoken');
const http = require('http');
const Raven = require('raven');
const helmet = require('helmet');

const UserService = require('./repositories/UserService.js');
const version = require('../version.js');
const Settings = require('./settings.js');

class Server {
    constructor(isDeveloping) {
        this.userService = new UserService({ dbPath: config.dbPath });
        this.isDeveloping = isDeveloping;
        this.server = http.Server(app);
    }

    init() {
        if(!this.isDeveloping) {
            Raven.config(config.sentryDsn, { release: version }).install();

            app.use(Raven.requestHandler());
            app.use(Raven.errorHandler());
        }

        app.use(helmet());

        app.set('trust proxy', 1);
        app.use(session({
            store: new MongoStore({ url: config.dbPath }),
            saveUninitialized: false,
            resave: false,
            secret: config.secret,
            cookie: { 
                maxAge: config.cookieLifetime,
                secure: config.https,
                httpOnly: true,
                domain: config.domain
            },
            name: 'sessionId'
            
        }));

        app.use(passport.initialize());
        app.use(passport.session());

        passport.use(new localStrategy(this.verifyUser.bind(this)));
        passport.serializeUser(this.serializeUser.bind(this));
        passport.deserializeUser(this.deserializeUser.bind(this));

        app.use(cookieParser());
        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({ extended: false }));

        api.init(app);

        app.use(express.static(__dirname + '/../public'));
        app.set('view engine', 'pug');
        app.set('views', path.join(__dirname, '..', 'views'));

        if(this.isDeveloping) {
            const webpackDevMiddleware = require('webpack-dev-middleware');
            const webpackHotMiddleware = require('webpack-hot-middleware');
            const webpackConfig = require('../webpack.config.js');
            const webpack = require('webpack');

            const compiler = webpack(webpackConfig);
            const middleware = webpackDevMiddleware(compiler, {
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
                log: false,
                path: '/__webpack_hmr',
                heartbeat: 2000
            }));
        }

        app.get('*', (req, res) => {
        let token = undefined;

            if(req.user) {
                token = jwt.sign(req.user, config.secret);
                req.user = _.omit(req.user, 'blockList');
            }

            res.render('index', { basedir: path.join(__dirname, '..', 'views'), user: Settings.getUserWithDefaultsSet(req.user), token: token, production: !this.isDeveloping });
        });


        return this.server;
    }

    run() {
        var port = config.lobby.port;

        this.server.listen(port, '0.0.0.0', function onStart(err) {
            if(err) {
                logger.error(err);
            }

            logger.info('==> 🌎 Listening on port %s. Open up http://0.0.0.0:%s/ in your browser.', port, port);
        });
    }

    verifyUser(username, password, done) {
        this.userService.getUserByUsername(username)
            .then(user => {
                if(!user) {
                    done(null, false, { message: 'Invalid username/password' });

                    return Promise.reject('Failed auth');
                }

                bcrypt.compare(password, user.password, function(err, valid) {
                    if(err) {
                        logger.info(err.message);

                        return done(err);
                    }

                    if(!valid) {
                        return done(null, false, { message: 'Invalid username/password' });
                    }

                    let userObj = {
                        username: user.username,
                        email: user.email,
                        emailHash: user.emailHash,
                        _id: user._id,
                        admin: user.admin,
                        settings: user.settings,
                        promptedActionWindows: user.promptedActionWindows,
                        permissions: user.permissions,
                        blockList: user.blockList
                    };

                    userObj = Settings.getUserWithDefaultsSet(userObj);

                    return done(null, userObj);
                });
            })
            .catch(err => {
                done(err);

                logger.info(err);
            });
    }

    serializeUser(user, done) {
        if(user) {
            done(null, user._id);
        }
    }

    deserializeUser(id, done) {
        this.userService.getUserById(id)
            .then(user => {
                if(!user) {
                    return done(new Error('user not found'));
                }

                let userObj = {
                    username: user.username,
                    email: user.email,
                    emailHash: user.emailHash,
                    _id: user._id,
                    admin: user.admin,
                    settings: user.settings,
                    promptedActionWindows: user.promptedActionWindows,
                    permissions: user.permissions,
                    blockList: user.blockList
                };

                done(null, userObj);
            });
    }
}
module.exports = Server;
