const monk = require('monk');
const escapeRegex = require('../util.js').escapeRegex;
const logger = require('../log.js');

class UserService {
    constructor(options) {
        let db = monk(options.dbPath);

        this.users = db.get('users');
    }

    getUserByUsername(username) {
        return this.users.find({ username: {'$regex': new RegExp('^' + escapeRegex(username.toLowerCase()) + '$', 'i') }})
            .then(users => {
                return users[0];
            })
            .catch(err => {
                logger.error('Error fetching users', err);

                throw new Error('Error occured fetching users');
            });
    }

    getUserById(id) {
        return this.users.find({ _id: id })
            .then(users => {
                return users[0];
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
            settings: user.settings,
            promptedActionWindows: user.promptedActionWindows,
            permissions: user.permissions
        };

        if(user.password && user.password !== '') {
            toSet.password = user.password;
        }

        return this.users.update({ username: user.username }, { '$set': toSet })
            .catch(err => {
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
}

module.exports = UserService;
