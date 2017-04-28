class Spectator {
    constructor(id, user) {
        this.user = user;
        this.name = this.user.username;
        this.emailHash = this.user.emailHash;
        this.id = id;

        this.buttons = [];
        this.menuTitle = 'Spectator mode';
    }

    isCardSelected() {
        return false;
    }

    isCardSelectable() {
        return false;
    }
}

module.exports = Spectator;
