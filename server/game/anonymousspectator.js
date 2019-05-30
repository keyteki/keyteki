class AnonymousSpectator {
    constructor() {
        this.name = 'Anonymous';
        this.emailHash = '';

        this.buttons = [];
        this.menuTitle = 'Spectator mode';
    }

    isSpectator() {
        return true;
    }

    getCardSelectionState() {
        return {};
    }

    getRingSelectionState() {
        return {};
    }
}

module.exports = AnonymousSpectator;
