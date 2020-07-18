const Settings = require('../settings');

class User {
    constructor(userData) {
        this.userData = userData;
        this.invalidDecks = undefined;
    }

    get id() {
        return this.userData.id;
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

    set blockList(value) {
        this.userData.blockList = value;
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

    get challonge() {
        return this.userData.challonge;
    }

    get verified() {
        return this.userData.verified;
    }

    get registered() {
        return this.userData.registered;
    }

    get isAdmin() {
        return this.userData.permissions && this.userData.permissions.isAdmin;
    }

    get isWinner() {
        return this.userData.permissions && this.userData.permissions.isWinner;
    }

    get isPreviousWinner() {
        return this.userData.permissions && this.userData.permissions.isPreviousWinner;
    }

    get isContributor() {
        return this.userData.permissions && this.userData.permissions.isContributor;
    }

    get isSupporter() {
        return this.userData.permissions && this.userData.permissions.isSupporter;
    }

    get role() {
        if (this.isAdmin) {
            return 'admin';
        }

        if (this.isWinner) {
            return 'winner';
        }

        if (this.isPreviousWinner) {
            return 'previouswinner';
        }

        if (this.isContributor) {
            return 'contributor';
        }

        if (this.isSupporter) {
            return 'supporter';
        }

        return 'user';
    }

    get avatar() {
        return this.userData && this.userData.settings && this.userData.settings.avatar;
    }

    get patreon() {
        return this.userData.patreon;
    }

    set patreon(value) {
        this.userData.patreon = value;
    }

    block(otherUser) {
        this.userData.blockList = this.userData.blockList || [];
        this.userData.blockList.push(otherUser.username.toLowerCase());
    }

    hasUserBlocked(otherUser) {
        return this.blockList.includes(otherUser.username.toLowerCase());
    }

    getWireSafeDetails() {
        let user = {
            id: this.userData.id,
            avatar: this.userData.settings && this.userData.settings.avatar,
            username: this.userData.username,
            email: this.userData.email,
            settings: this.userData.settings,
            permissions: this.userData.permissions,
            verified: this.userData.verified,
            challonge: this.userData.challonge
        };

        user = Settings.getUserWithDefaultsSet(user);

        return user;
    }

    getShortSummary() {
        return {
            username: this.username,
            avatar: this.avatar,
            name: this.username,
            role: this.role
        };
    }

    getFullDetails() {
        let user = Object.assign({ invalidDecks: this.invalidDecks }, this.userData);

        delete user.password;

        user = Settings.getUserWithDefaultsSet(user);
        user.avatar = this.avatar;

        return user;
    }

    getDetails() {
        let user = Object.assign({ invalidDecks: this.invalidDecks }, this.userData);

        delete user.password;
        delete user.tokens;

        user = Settings.getUserWithDefaultsSet(user);
        user.role = this.role;
        user.avatar = this.avatar;

        return user;
    }
}

module.exports = User;
