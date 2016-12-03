class Spectator {
    constructor(id, user) {
        this.id = id;
        this.user = user;
        this.name = this.user.username;

        this.buttons = [];
        this.menuTitle = 'Spectator mode';
    }
}

module.exports = Spectator;
