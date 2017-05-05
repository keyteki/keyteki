const mongoskin = require('mongoskin');
const escapeRegex = require('../util.js').escapeRegex;
const logger = require('../log.js');

const BaseRepository = require('./baseRepository.js');

class UserRepository extends BaseRepository {
    getUserByUsername(username, callback) {
        this.db.collection('users').find({ username: {'$regex': new RegExp('^' + escapeRegex(username.toLowerCase()) + '$', 'i') }}).toArray((err, users) => {
            if(err) {
                logger.error(err);

                this.callCallbackIfPresent(callback, err);

                return;
            }

            this.callCallbackIfPresent(callback, err, users[0]);
        });
    }

    getUserById(id, callback) {
        this.db.collection('users').find({ _id: mongoskin.helper.toObjectID(id) }).toArray((err, users) => {
            if(err) {
                logger.error(err);

                this.callCallbackIfPresent(callback, err);

                return;
            }

            this.callCallbackIfPresent(callback, err, users[0]);
        });
    }

    addUser(user, callback) {
        this.db.collection('users').insert(user, (err, result) => {
            if(err) {
                logger.error(err);
                this.callCallbackIfPresent(callback, err);

                return;
            }

            this.callCallbackIfPresent(callback, err, result);
        });
    }

    update(user, callback) {
        var toSet = {
            email: user.email,
            settings: user.settings, 
            promptedActionWindows: user.promptedActionWindows             
        };

        if(user.password && user.password !== '') {
            toSet.password = user.password;
        }

        this.db.collection('users').update({ username: user.username }, { '$set': toSet }, (err, result) => {
            if(err) {
                logger.error(err);

                this.callCallbackIfPresent(callback, err);

                return;
            }

            this.callCallbackIfPresent(callback, err, result);
        });        
    }

    setResetToken(user, token, tokenExpiration, callback) {
        this.db.collection('users').update({ username: user.username }, { '$set': { resetToken: token, tokenExpires: tokenExpiration } }, (err, result) => {
            if(err) {
                logger.error(err);

                this.callCallbackIfPresent(callback, err);

                return;
            }

            this.callCallbackIfPresent(callback, err, result);
        });
    }

    setPassword(user, password, callback) {
        this.db.collection('users').update({ username: user.username }, { '$set': { password: password } }, (err, result) => {
            if(err) {
                logger.error(err);

                this.callCallbackIfPresent(callback, err);

                return;
            }

            this.callCallbackIfPresent(callback, err, result);
        });
    }

    clearResetToken(user, callback) {
        this.db.collection('users').update({ username: user.username }, { '$set': { resetToken: undefined, tokenExpires: undefined } }, (err, result) => {
            if(err) {
                logger.error(err);

                this.callCallbackIfPresent(callback, err);

                return;
            }

            this.callCallbackIfPresent(callback, err, result);
        });
    }
}

module.exports = UserRepository;
