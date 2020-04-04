const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const ConfigService = require('./services/ConfigService');
const passport = require('passport');
const logger = require('./log.js');
const api = require('./api');
const path = require('path');
const http = require('http');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const historyApiFallback = require('connect-history-api-fallback');
const webpack = require('webpack');
const webpackConfig = require('../webpack.dev.js');
const monk = require('monk');
const passportJwt = require('passport-jwt');
const Sentry = require('@sentry/node');

const JwtStrategy = passportJwt.Strategy;
const ExtractJwt = passportJwt.ExtractJwt;

const UserService = require('./services/UserService.js');
const version = require('../version.js');

class Server {
    constructor(isDeveloping) {
        this.configService = new ConfigService();
        let db = monk(this.configService.getValue('dbPath'));
        this.userService = new UserService(db);
        this.isDeveloping = isDeveloping;
        this.server = http.Server(app);
    }

    init(options) {
        if(!this.isDeveloping) {
            Sentry.init({ dsn: this.configService.getValue('sentryDsn'), release: version.build });
            app.use(Sentry.Handlers.requestHandler());
            app.use(Sentry.Handlers.errorHandler());
        }

        var opts = {};
        opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
        opts.secretOrKey = this.configService.getValue('secret');

        passport.use(new JwtStrategy(opts, (jwtPayload, done) => {
            this.userService.getUserById(jwtPayload.id).then(user => {
                if(user) {
                    return done(null, user.getWireSafeDetails());
                }

                return done(null, false);
            }).catch(err => {
                return done(err, false);
            });
        }));
        app.use(passport.initialize());

        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({ extended: false }));

        api.init(app, options);

        app.use(express.static(__dirname + '/../public'));
        app.use(express.static(__dirname + '/../dist'));

        if(this.isDeveloping) {
            const compiler = webpack(webpackConfig);
            const middleware = webpackDevMiddleware(compiler, {
                hot: true,
                contentBase: 'client',
                publicPath: '/',
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

            app.set('view engine', 'pug');
            app.set('views', path.join(__dirname, '..', 'views'));

            app.use(middleware);
            app.use(webpackHotMiddleware(compiler, {
                log: false,
                path: '/__webpack_hmr',
                heartbeat: 2000
            }));
            app.use(historyApiFallback());
            app.use(middleware);
        } else {
            app.get('*', (req, res) => {
                res.sendFile(path.join(__dirname, '..', 'dist', 'index.html'));
            });
        }

        // Define error middleware last
        app.use(function(err, req, res, next) {
            logger.error(err);

            if(!res.headersSent && req.xhr) {
                return res.status(500).send({ success: false });
            }

            next(err);
        });

        return this.server;
    }

    run() {
        let port = process.env.PORT || this.configService.getValueForSection('lobby', 'port') || 4000;

        this.server.listen(port, '0.0.0.0', function onStart(err) {
            if(err) {
                logger.error(err);
            }

            logger.info('==> ?? Listening on port %s. Open up http://0.0.0.0:%s/ in your browser.', port, port);
        });
    }

    serializeUser(user, done) {
        if(user) {
            done(null, user._id);
        }
    }
}

module.exports = Server;
