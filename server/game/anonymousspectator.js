class AnonymousSpectator {
    constructor() {
        this.name = 'Anonymous';
        this.emailHash = '';

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

module.exports = AnonymousSpectator;
