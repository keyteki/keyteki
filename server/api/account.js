const logger = require('../log.js');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const config = require('config');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const util = require('../util.js');
const nodemailer = require('nodemailer');
const moment = require('moment');
const monk = require('monk');
const UserService = require('../services/UserService.js');

let db = monk(config.dbPath);
let userService = new UserService(db);

function hashPassword(password, rounds) {
    return new Promise((resolve, reject) => {
        bcrypt.hash(password, rounds, function(err, hash) {
            if(err) {
                return reject(err);
            }

            return resolve(hash);
        });
    });
}

function loginUser(request, user) {
    return new Promise((resolve, reject) => {
        request.login(user, function(err) {
            if(err) {
                return reject(err);
            }

            resolve();
        });
    });
}

function sendEmail(address, email) {
    return new Promise((resolve, reject) => {
        var emailTransport = nodemailer.createTransport(config.emailPath);

        emailTransport.sendMail({
            from: 'Jigoku Online <noreply@jigoku.online>',
            to: address,
            subject: 'Your account at Jigoku Online',
            text: email
        }, function(error) {
            if(error) {
                reject(error);
            }

            resolve();
        });
    });
}

module.exports.init = function(server) {
    server.post('/api/account/register', function(req, res) {
        if(!req.body.password) {
            res.send({ success: false, message: 'No password specified' });

            return Promise.reject('No password');
        }

        if(!req.body.email) {
            res.send({ success: false, message: 'No email specified' });

            return Promise.reject('No email');
        }

        if(!req.body.username) {
            res.send({ success: false, message: 'No username specified' });

            return Promise.reject('No username');
        }

        userService.getUserByEmail(req.body.email)
            .then(user => {
                if(user) {
                    res.send({ success: false, message: 'An account with that email already exists, please use another' });

                    return Promise.reject('Account email exists');
                }

                return userService.getUserByUsername(req.body.username);
            })
            .then(user => {
                if(user) {
                    res.send({ success: false, message: 'An account with that name already exists, please choose another' });

                    return Promise.reject('Account exists');
                }
            })
            .then(() => {
                return hashPassword(req.body.password, 10);
            })
            .then(passwordHash => {
                let user = {
                    password: passwordHash,
                    registered: new Date(),
                    username: req.body.username,
                    email: req.body.email,
                    emailHash: crypto.createHash('md5').update(req.body.email).digest('hex')
                };

                return userService.addUser(user);
            })
            .then(user => {
                return loginUser(req, user);
            })
            .then(() => {
                res.send({ success: true, user: req.body, token: jwt.sign(req.user, config.secret)});
            })
            .catch(() => {
                res.send({ success: false, message: 'An error occured registering your account' });
            });
    });

    server.post('/api/account/check-username', function(req, res) {
        userService.getUserByUsername(req.body.username)
            .then(user => {
                if(user) {
                    return res.send({ success: true, message: 'An account with that name already exists, please choose another' });
                }

                return res.send({ success: true });
            })
            .catch(() => {
                return res.send({ success: false, message: 'Error occured looking up username' });
            });
    });

    server.post('/api/account/logout', function(req, res) {
        req.logout();

        res.send({ success: true});
    });

    server.post('/api/account/login', passport.authenticate('local'), function(req, res) {
        res.send({ success: true, user: req.user, token: jwt.sign(req.user, config.secret) });
    });

    server.post('/api/account/password-reset-finish', function(req, res) {
        let resetUser;

        if(!req.body.id || !req.body.token || !req.body.newPassword) {
            return res.send({ success: false, message: 'Invalid parameters' });
        }

        userService.getUserById(req.body.id)
            .then(user => {
                if(!user) {
                    return Promise.reject('User not found');
                }

                if(!user.resetToken) {
                    logger.error('Got unexpected reset request for user', user.username);

                    res.send({ success: false, message: 'An error occured resetting your password, check the url you have entered and try again' });

                    return Promise.reject('No reset token');
                }

                let now = moment();

                if(user.tokenExpires < now) {
                    res.send({ success: false, message: 'The reset token you have provided has expired' });

                    logger.error('Token expired', user.username);

                    return Promise.reject('Token expires');
                }

                let hmac = crypto.createHmac('sha512', config.hmacSecret);
                let resetToken = hmac.update('RESET ' + user.username + ' ' + user.tokenExpires).digest('hex');

                if(resetToken !== req.body.token) {
                    logger.error('Invalid reset token', user.username, req.body.token);

                    res.send({ success: false, message: 'An error occured resetting your password, check the url you have entered and try again'});

                    return Promise.reject('Invalid token');
                }

                resetUser = user;

                return hashPassword(req.body.newPassword, 10);
            })
            .then(passwordHash => {
                return userService.setPassword(resetUser, passwordHash);
            })
            .then(() => {
                return userService.clearResetToken(resetUser);
            })
            .then(() => {
                res.send({ success: true });
            })
            .catch(err => {
                logger.error(err);

                res.send({ success: false, message: 'An error occured resetting your password, check the url you have entered and try again'});
            });
    });

    server.post('/api/account/password-reset', function(req, res) {
        let emailUser;
        let resetToken;
        let captchaDone = false;

        util.httpRequest('https://www.google.com/recaptcha/api/siteverify?secret=' + config.captchaKey + '&response=' + req.body.captcha)
            .then(response => {
                let answer = JSON.parse(response);

                if(!answer.success) {
                    return res.send({ success: false, message: 'Please complete the captcha correctly' });
                }

                res.send({ success: true });

                captchaDone = true;

                return userService.getUserByUsername(req.body.username);
            })
            .then(user => {
                if(!user) {
                    logger.error('Username not found for password reset', req.body.username);

                    return Promise.reject('Username not found');
                }

                let expiration = moment().add(4, 'hours');
                let formattedExpiration = expiration.format('YYYYMMDD-HH:mm:ss');
                let hmac = crypto.createHmac('sha512', config.hmacSecret);

                resetToken = hmac.update('RESET ' + user.username + ' ' + formattedExpiration).digest('hex');

                emailUser = user;

                return userService.setResetToken(user, resetToken, formattedExpiration);
            })
            .then(() => {
                let url = 'https://jigoku.online/reset-password?id=' + emailUser._id + '&token=' + resetToken;
                let emailText = 'Hi,\n\nSomeone, hopefully you, has requested their password on Jigoku Online (https://jigoku.online) to be reset.  If this was you, click this link ' + url + ' to complete the process.\n\n' +
                    'If you did not request this reset, do not worry, your account has not been affected and your password has not been changed, just ignore this email.\n' +
                    'Kind regards,\n\n' +
                    'The Jigoku Online team';

                return sendEmail(emailUser.email, emailText);
            })
            .catch(err => {
                logger.error(err);

                if(!captchaDone) {
                    return res.send({ success: false, message: 'There was a problem verifying the capthca, please try again' });
                }
            });
    });

    function updateUser(res, user) {
        return userService.update(user)
            .then(() => {
                res.send({ success: true, user: {
                    username: user.username,
                    email: user.email,
                    emailHash: user.emailHash,
                    _id: user._id,
                    admin: user.admin,
                    settings: user.settings,
                    promptedActionWindows: user.promptedActionWindows,
                    permissions: user.permissions
                }, token: jwt.sign(user, config.secret) });
            })
            .catch(() => {
                return res.send({ success: false, message: 'An error occured updating your user profile' });
            });
    }

    server.put('/api/account/:username', (req, res) => {
        let userToSet = JSON.parse(req.body.data);
        let existingUser;

        if(!req.user) {
            return res.status(401).send({ message: 'Unauthorized' });
        }

        if(req.user.username !== req.params.username) {
            return res.status(403).send({ message: 'Unauthorized' });
        }

        userService.getUserByUsername(req.params.username)
            .then(user => {
                if(!user) {
                    return res.status(404).send({ message: 'Not found'});
                }

                user.email = userToSet.email;
                user.settings = userToSet.settings;
                user.promptedActionWindows = userToSet.promptedActionWindows;

                existingUser = user;

                if(userToSet.password && userToSet.password !== '') {
                    return hashPassword(userToSet.password, 10);
                }

                return updateUser(res, user);
            })
            .then(passwordHash => {
                if(!passwordHash) {
                    return;
                }

                existingUser.password = passwordHash;

                return updateUser(res, existingUser);
            })
            .catch(() => {
                return res.send({ success: false, message: 'An error occured updating your user profile' });
            });
    });
};
