const monk = require('monk');
const moment = require('moment');
const crypto = require('crypto');

const escapeRegex = require('../util').escapeRegex;
const logger = require('../log');
const User = require('../models/User');

class UserService {
    constructor(db, configService) {
        this.users = db.get('users');
        this.sessions = db.get('sessions');
        this.configService = configService;
    }

    getUserByUsername(username) {
        return this.users.find({ username: { '$regex': new RegExp('^' + escapeRegex(username.toLowerCase()) + '$', 'i') } })
            .then(users => {
                return users[0] && new User(users[0]);
            })
            .catch(err => {
                logger.error('Error fetching users', err);

                throw new Error('Error occured fetching users');
            });
    }

    getUserByEmail(email) {
        return this.users.find({ email: { '$regex': new RegExp('^' + escapeRegex(email.toLowerCase()) + '$', 'i') } })
            .then(users => {
                return users[0] && new User(users[0]);
            })
            .catch(err => {
                logger.error('Error fetching users', err);

                throw new Error('Error occured fetching users');
            });
    }

    getUserById(id) {
        return this.users.find({ _id: id })
            .then(users => {
                return users[0] && new User(users[0]);
            })
            .catch(err => {
                logger.error('Error fetching users', err);

                throw new Error('Error occured fetching users');
            });
    }

    addUser(user) {
        return this.users.insert(user)
            .then(() => {
                return user;
            })
            .catch(err => {
                logger.error('Error adding user', err, user);

                throw new Error('Error occured adding user');
            });
    }

    update(user) {
        var toSet = {
            email: user.email,
            enableGravatar: user.enableGravatar,
            settings: user.settings,
            promptedActionWindows: user.promptedActionWindows,
            permissions: user.permissions,
            verified: user.verified,
            disabled: user.disabled
        };

        if(user.password && user.password !== '') {
            toSet.password = user.password;
        }

        return this.users.update({ username: user.username }, { '$set': toSet }).catch(err => {
            logger.error(err);

            throw new Error('Error setting user details');
        });
    }

    updateBlockList(user) {
        return this.users.update({ username: user.username }, {
            '$set': {
                blockList: user.blockList
            }
        }).catch(err => {
            logger.error(err);

            throw new Error('Error setting user details');
        });
    }

    setResetToken(user, token, tokenExpiration) {
        return this.users.update({ username: user.username }, { '$set': { resetToken: token, tokenExpires: tokenExpiration } })
            .catch(err => {
                logger.error(err);

                throw new Error('Error setting reset token');
            });
    }

    setPassword(user, password) {
        return this.users.update({ username: user.username }, { '$set': { password: password } })
            .catch(err => {
                logger.error(err);

                throw new Error('Error setting password');
            });
    }

    clearResetToken(user) {
        return this.users.update({ username: user.username }, { '$set': { resetToken: undefined, tokenExpires: undefined } })
            .catch(err => {
                logger.error(err);

                throw new Error('Error clearing reset token');
            });
    }

    activateUser(user) {
        return this.users.update({ username: user.username }, { '$set': { activationToken: undefined, activationExpiry: undefined, verified: true } })
            .catch(err => {
                logger.error(err);

                throw new Error('Error activating user');
            });
    }

    clearUserSessions(username) {
        return new Promise(async (resolve, reject) => {
            const user = this.getUserByUsername(username);
            if(!user) {
                return reject('User not found');
            }

            await this.users.update({ username: username }, { '$set': { tokens: [] } });

            resolve(true);
        });
    }

    addRefreshToken(username, token, ip) {
        let expiration = moment().add(1, 'months');
        let hmac = crypto.createHmac('sha512', this.configService.getValueForSection('lobby', 'hmacSecret'));

        let newId = monk.id();
        let encodedToken = hmac.update(`REFRESH ${username} ${newId}`).digest('hex');

        return this.users.update({ username: username }, {
            '$push': {
                tokens: {
                    '_id': newId,
                    token: encodedToken,
                    exp: expiration.toDate(),
                    ip: ip,
                    lastUsed: new Date()
                }
            }
        }).then(() => {
            return {
                id: newId,
                username: username,
                token: encodedToken
            };
        }).catch(err => {
            logger.error(err);

            return undefined;
        });
    }

    verifyRefreshToken(username, refreshToken) {
        let hmac = crypto.createHmac('sha512', this.configService.getValueForSection('lobby', 'hmacSecret'));
        let encodedToken = hmac.update(`REFRESH ${username} ${refreshToken._id}`).digest('hex');

        if(encodedToken !== refreshToken.token) {
            return false;
        }

        let now = moment();
        if(refreshToken.exp < now) {
            return false;
        }

        return true;
    }

    updateRefreshTokenUsage(tokenId, ip) {
        return this.users.update({ tokens: { '$elemMatch': { _id: tokenId } } }, {
            $set: { 'tokens.$.ip': ip, 'tokens.$.lastUsed': new Date() }
        }).catch(err => {
            logger.error(err);
        });
    }

    getRefreshTokenById(username, tokenId) {
        return this.users.find({ username: username, tokens: { '$elemMatch': { _id: tokenId } } })
            .then(users => {
                return users[0];
            })
            .catch(err => {
                logger.error(err);
            });
    }

    removeRefreshToken(username, tokenId) {
        return this.users.update({ username: username }, { '$pull': { tokens: { _id: tokenId } } }).catch(err => {
            logger.error(err);
        });
    }
}

module.exports = UserService;
