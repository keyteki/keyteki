const db = require('monk')('mongodb://127.0.0.1:27017/throneteki');
const users = db.get('users');
const escapeRegex = require('../util.js').escapeRegex;

class UserRepository {
    getUserByUsername(username) {
        return users.findOne({ username: {'$regex': new RegExp('^' + escapeRegex(username.toLowerCase()) + '$', 'i') }});
    }

    getUserById(id) {
        return users.findOne({ _id: id });
    }

    addUser(user) {
        return users.insert(user);
    }

    setResetToken(user, token, tokenExpiration) {
        return users.update({ username: user.username }, { '$set': { resetToken: token, tokenExpires: tokenExpiration } });
    }

    setPassword(user, password) {
        return users.update({ username: user.username }, { '$set': { password: password } });
    }

    clearResetToken(user) {
        return users.update({ username: user.username }, { '$set': { resetToken: undefined, tokenExpires: undefined } });
    }
}

module.exports = UserRepository;
