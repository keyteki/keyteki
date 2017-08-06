const logger = require('../log.js');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const config = require('../config.js');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const util = require('../util.js');
const nodemailer = require('nodemailer');
const moment = require('moment');
const UserRepository = require('../repositories/userRepository.js');

var userRepository = new UserRepository(config.dbPath);

module.exports.init = function(server) {
    server.post('/api/account/register', function(req, res, next) {
        userRepository.getUserByUsername(req.body.username, (err, user) => {
            if(user) {
                res.send({ success: false, message: 'An account with that name already exists, please choose another' });
                return next();
            }

            bcrypt.hash(req.body.password, 10, (err, hash) => {
                req.body.password = hash;
                req.body.registered = new Date();
                req.body.emailHash = crypto.createHash('md5').update(req.body.email).digest('hex');

                userRepository.addUser(req.body, (err) => {
                    if(err) {
                        res.send({ success: false, message: 'An error occured registering your account' });

                        return next(err);
                    }

                    req.login(req.body, function(err) {
                        if(err) {
                            res.send({ success: false, message: 'An error occured registering your account' });

                            return next(err);
                        }

                        res.send({ success: true, user: req.body, token: jwt.sign(req.user, config.secret)});
                    });
                });
            });
        });
    });

    server.post('/api/account/check-username', function(req, res) {
        userRepository.getUserByUsername(req.body.username, (err, user) => {
            if(user) {
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
        res.send({ success: true, user: req.user, token: jwt.sign(req.user, config.secret) });
    });

    server.post('/api/account/password-reset-finish', function(req, res, next) {
        var resetUser;

        if(!req.body.id || !req.body.token || !req.body.newPassword) {
            return res.send({ success: false, message: 'Invalid parameters' });
        }

        userRepository.getUserById(req.body.id, (err, user) => {
            if(!user) {
                return;
            }

            if(!user.resetToken) {
                logger.error('Got unexpected reset request for user', user.username);

                res.send({ success: false, message: 'An error occured resetting your password, check the url you have entered and try again'});

                return next();
            }

            resetUser = user;

            var now = moment();

            if(user.tokenExpires < now) {
                res.send({ success: false, message: 'The reset token you have provided has expired'});

                logger.error('Token expired');

                return next();
            }

            var hmac = crypto.createHmac('sha512', config.hmacSecret);
            var resetToken = hmac.update('RESET ' + user.username + ' ' + user.tokenExpires).digest('hex');

            if(resetToken !== req.body.token) {
                logger.error('Invalid reset token');

                res.send({ success: false, message: 'An error occured resetting your password, check the url you have entered and try again'});

                return next();
            }

            bcrypt.hash(req.body.newPassword, 10, function(err, hash) {
                if(err) {
                    logger.error(err);

                    res.send({ success: false, message: 'An error occured resetting your password, check the url you have entered and try again'});

                    return next(err);
                }

                userRepository.setPassword(resetUser, hash, (err) => {
                    if(err) {
                        res.send({ success: false, message: 'An error occured resetting your password, check the url you have entered and try again'});

                        return next(err);
                    }

                    userRepository.clearResetToken(resetUser, (err) => {
                        if(err) {
                            res.send({ success: false, message: 'An error occured resetting your password, check the url you have entered and try again'});

                            return next(err);
                        }

                        res.send({ success: true });
                    });
                });
            });
        });
    });

    server.post('/api/account/password-reset', function(req, res) {
        util.httpRequest('https://www.google.com/recaptcha/api/siteverify?secret=' + config.captchaKey + '&response=' + req.body.captcha, (err, response) => {
            var answer = JSON.parse(response);

            if(!answer.success) {
                return res.send({ success: false, message: 'Please complete the captcha correctly' });
            }

            res.send({ success: true });

            userRepository.getUserByUsername(req.body.username, (err, user) => {
                if(!user) {
                    logger.error('Username not found for password reset', req.body.username);

                    return;
                }

                var expiration = moment().add(4, 'hours');
                var formattedExpiration = expiration.format('YYYYMMDD-HH:mm:ss');
                var hmac = crypto.createHmac('sha512', config.hmacSecret);

                var resetToken = hmac.update('RESET ' + user.username + ' ' + formattedExpiration).digest('hex');

                userRepository.setResetToken(user, resetToken, formattedExpiration, (err) => {
                    logger.error(err);
                });

                var url = 'https://jigoku.online/reset-password?id=' + user._id + '&token=' + resetToken;
                var emailText = 'Hi,\n\nSomeone, hopefully you, has requested their password on Jigoku Online (https://jigoku.online) to be reset.  If this was you, click this link ' + url + ' to complete the process.\n\n' +
                    'If you did not request this reset, do not worry, your account has not been affected and your password has not been changed, just ignore this email.\n' +
                    'Kind regards,\n\n' +
                    'The Jigoku Online team';

                var emailTransport = nodemailer.createTransport(config.emailPath);

                emailTransport.sendMail({
                    from: 'Jigoku Online <noreply@jigoku.online>',
                    to: user.email,
                    subject: 'Your account at Jigoku Online',
                    text: emailText
                }, function(error) {
                    if(error) {
                        logger.error(error);
                    }
                });
            });
        });
    });

    function updateUser(res, user) {
        userRepository.update(user, err => {
            if(err) {
                return res.send({ success: false, message: 'An error occured updating your user profile' });
            }

            res.send({ success: true, user: user, token: jwt.sign(user, config.secret) });
        });
    }

    server.put('/api/account/:username', (req, res) => {
        let user = JSON.parse(req.body.data);

        if(!req.user || req.user.username !== req.params.username) {
            return res.status(401).send({ message: 'Unauthorized' });
        }

        userRepository.getUserByUsername(req.params.username, (err, existingUser) => {
            if(err) {
                return res.status({ success: false, message: 'An error occured updating your user profile' });
            }

            if(!existingUser) {
                return res.status(404).send({ message: 'Not found'});
            }

            existingUser.email = user.email;
            existingUser.settings = user.settings;
            existingUser.promptedActionWindows = user.promptedActionWindows;

            if(user.password && user.password !== '') {
                bcrypt.hash(user.password, 10, (err, hash) => {
                    existingUser.password = hash;

                    updateUser(res, existingUser);
                });
            } else {
                updateUser(res, existingUser);
            }
        });
    });
};
