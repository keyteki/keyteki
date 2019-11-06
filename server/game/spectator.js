class Spectator {
    constructor(id, user) {
        this.user = user;
        this.name = this.user.username;
        this.emailHash = this.user.emailHash;
        this.id = id;

        this.buttons = [];
        this.menuTitle = 'Spectator mode';
    }

    isSpectator() {
        return true;
    }

    getCardSelectionState() {
        return {};
    }
}

module.exports = Spectator;
