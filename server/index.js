const path = require('path');
const express = require('express');
const webpack = require('webpack');
const webpackMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const config = require('../webpack.config.js');
const api = require('./api');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser')
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const logger = require('./log.js');

const passport = require('passport');
const localStrategy = require('passport-local').Strategy;

const mongoskin = require('mongoskin');
const db = mongoskin.db('mongodb://127.0.0.1:27017/throneteki');

const isDeveloping = process.env.NODE_ENV !== 'production';
const port = isDeveloping ? 4000 : process.env.PORT;
const app = express();

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(session({
    store: new MongoStore({ url: 'mongodb://127.0.0.1:27017/throneteki' }),
    saveUninitialized: false,
    resave: false,
    secret: 'thisisreallysecret',
    cookie: { maxAge: 60 * 60 * 24 * 7 } // 7 days
}));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new localStrategy(
    function(username, password, done) {
        db.collections('user').findOne({ username: username }, function(err, user) {
            if(err) {
                return done(err);
            }
            if(!user || !user.validPassword(password)) {
                return done(null, false, { message: 'Invalid username/password' });
            }

            return done(null, user);
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
        done(err, { username: user.username, email: user.email, _id: user._id });
    });
});

api.init(app);

function runServer() {
    if(isDeveloping) {
        const compiler = webpack(config);
        const middleware = webpackMiddleware(compiler, {
            publicPath: config.output.publicPath,
            contentBase: 'client',
            stats: {
                colors: true,
                hash: false,
                timings: true,
                chunks: false,
                chunkModules: false,
                modules: false
            }
        });

        app.use(middleware);
        app.use(webpackHotMiddleware(compiler));
        app.get('*', function response(req, res) {
            logger.info(req.user);
            res.write(middleware.fileSystem.readFileSync(path.join(__dirname, '..', 'public/index.html')));
            res.end();
        });
    } else {
        app.use(express.static(__dirname + '/public'));
        app.get('*', function response(req, res) {
            res.sendFile(path.join(__dirname, 'public/index.html'));
        });
    }

    app.listen(port, '0.0.0.0', function onStart(err) {
        if(err) {
            logger.error(err);
        }
        logger.info('==> 🌎 Listening on port %s. Open up http://0.0.0.0:%s/ in your browser.', port, port);
    });
}

module.exports = runServer;
