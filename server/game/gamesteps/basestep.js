class BaseStep {
    constructor(game) {
        this.game = game;
    }

    continue() {
    }

    onCardClicked(player, card) {
        return false;
    }

    onMenuCommand(player, arg) {
        return false;
    }
}

module.exports = BaseStep;
