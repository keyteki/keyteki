import express from 'express';
import bodyParser from 'body-parser';
import passport from 'passport';
import logger from './log.js';
import * as api from './api/index.js';
import { dirname, join } from 'node:path';
import { createServer as createHttpServer } from 'node:http';
import historyApiFallback from 'connect-history-api-fallback';
import * as Sentry from '@sentry/node';
import ConfigService from './services/ConfigService.js';
import UserService from './services/UserService.js';
import { fileURLToPath } from 'node:url';

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

import passportJwt from 'passport-jwt';
const { Strategy: JwtStrategy, ExtractJwt } = passportJwt;

class Server {
    constructor(isDeveloping) {
        this.configService = new ConfigService();

        this.userService = new UserService(this.configService);
        this.isDeveloping = isDeveloping;
        this.server = createHttpServer(app);
    }

    async init(options) {
        if (!this.isDeveloping) {
            Sentry.init({
                dsn: this.configService.getValue('sentryDsn'),
                release: process.env.VERSION || 'Local build'
            });
            app.use(Sentry.Handlers.requestHandler());
            app.use(Sentry.Handlers.errorHandler());
        }

        var opts = {};
        opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
        opts.secretOrKey = this.configService.getValue('secret');

        passport.use(
            new JwtStrategy(opts, (jwtPayload, done) => {
                this.userService
                    .getUserById(jwtPayload.id)
                    .then((user) => {
                        if (user) {
                            // @ts-ignore runtime User has method getWireSafeDetails
                            return done(null, user.getWireSafeDetails());
                        }

                        return done(null, false);
                    })
                    .catch((err) => {
                        return done(err, false);
                    });
            })
        );
        app.use(passport.initialize());

        app.use(bodyParser.json({ limit: '5mb' }));
        app.use(bodyParser.urlencoded({ extended: false }));

        api.init(app, options);

        app.use(express.static(join(__dirname, '..', 'public')));
        app.use(express.static(join(__dirname, '..', 'dist')));

        if (this.isDeveloping) {
            // Vite dev server middleware
            const { createServer } = await import('vite');
            const vite = await createServer({
                root: join(__dirname, '..'),
                server: { middlewareMode: true }
            });

            // Vite middleware must come BEFORE history fallback
            app.use(vite.middlewares);
            app.use(historyApiFallback());
        } else {
            app.get('*', (req, res) => {
                res.sendFile(join(__dirname, '..', 'dist', 'index.html'));
            });
        }

        // Define error middleware last
        app.use(function (err, req, res, next) {
            logger.error(err);

            if (!res.headersSent && req.xhr) {
                return res.status(500).send({ success: false });
            }

            next(err);
        });

        return this.server;
    }

    run() {
        let port =
            process.env.PORT || this.configService.getValueForSection('lobby', 'port') || 4000;

        this.server.listen(port, '0.0.0.0', function onStart(err) {
            if (err) {
                logger.error(err);
            }

            logger.info(
                `==> ?? Listening on port ${port}. Open up http://0.0.0.0:${port}/ in your browser.`
            );
        });
    }

    serializeUser(user, done) {
        if (user) {
            done(null, user.id);
        }
    }
}

export default Server;
