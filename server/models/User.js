const Settings = require('../settings');

class User {
    constructor(userData) {
        this.userData = userData;
        this.invalidDecks = undefined;
    }

    get _id() {
        return this.userData._id;
    }

    get disabled() {
        return this.userData.disabled;
    }

    get username() {
        return this.userData.username;
    }

    get tokens() {
        return this.userData.tokens;
    }

    get activationToken() {
        return this.userData.activationToken;
    }

    get activationTokenExpiry() {
        return this.userData.activationTokenExpiry;
    }

    get resetToken() {
        return this.userData.resetToken;
    }

    get tokenExpires() {
        return this.userData.tokenExpires;
    }

    get blockList() {
        return this.userData.blockList || [];
    }

    get password() {
        return this.userData.password;
    }

    get permissions() {
        return this.userData.permissions || [];
    }

    get email() {
        return this.userData.email;
    }

    get enableGravatar() {
        return this.userData.enableGravatar;
    }

    get verified() {
        return this.userData.verified;
    }

    get registered() {
        return this.userData.registered;
    }

    getWireSafeDetails() {
        let user = {
            _id: this.userData._id,
            username: this.userData.username,
            email: this.userData.email,
            settings: this.userData.settings,
            promptedActionWindows: this.userData.promptedActionWindows,
            permissions: this.userData.permissions,
            verified: this.userData.verified,
            enableGravatar: this.userData.enableGravatar
        };

        user = Settings.getUserWithDefaultsSet(user);

        return user;
    }

    getShortSummary() {
        return {
            username: this.username,
            name: this.username
        };
    }

    getFullDetails() {
        let user = Object.assign({ invalidDecks: this.invalidDecks }, this.userData);

        delete user.password;

        user = Settings.getUserWithDefaultsSet(user);

        return user;
    }

    getDetails() {
        let user = Object.assign({ invalidDecks: this.invalidDecks }, this.userData);

        delete user.password;
        delete user.tokens;

        user = Settings.getUserWithDefaultsSet(user);

        return user;
    }
}

module.exports = User;
