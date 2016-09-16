const mongoskin = require('mongoskin');
const db = mongoskin.db('mongodb://127.0.0.1:27017/throneteki');
const logger = require('./../log.js');
const bcrypt = require('bcrypt');
const passport = require('passport');

module.exports.init = function(server) {
    server.post('/api/account/register', function(req, res, next) {
        db.collection('users').findOne({ username: req.body.username }, function(err, account) {
            if(err) {
                res.send({ success: false, message: 'An error occured registering your account' });
                logger.info(err.message);
                return next(err);
            }

            if(account) {
                res.send({ success: false, message: 'An account with that name already exists, please choose another' });
                return next();
            }

            bcrypt.hash(req.body.password, 10, function(err, hash) {
                if(err) {
                    res.send({ success: false, message: 'An error occured registering your account' });
                    logger.info(err.message);
                    return next(err);
                }

                req.body.password = hash;
                req.body.registered = new Date();

                db.collection('users').insert(req.body, function(err) {
                    if(err) {
                        res.send({ success: false, message: 'An error occured registering your account' });
                        logger.info(err.message);
                        return next(err);
                    }

                    req.login(req.body, function(err) {
                        if(err) {
                            res.send({ success: false, message: 'An error occured registering your account' });
                            logger.info(err.message);
                            return next(err);
                        }

                        logger.info(req.user);

                        res.send({ success: true, user: req.body });
                    });
                });
            });
        });
    });

    server.post('/api/account/check-username', function(req, res) {
        db.collection('users').findOne({ username: req.body.username }, function(err, account) {
            if(err) {
                res.send({ message: '' });
                logger.info(err.message);
                return;
            }

            if(account) {
                res.send({ message: 'An account with that name already exists, please choose another' });
                return;
            }

            res.send({ message: '' });
        });
    });

    server.post('/api/account/logout', function(req, res) {
        req.logout();

        res.send({ success: true});
    });

    server.post('/api/account/login', passport.authenticate('local'), function(req, res) {
        res.send({ success: true, user: req.user });
    });
};
