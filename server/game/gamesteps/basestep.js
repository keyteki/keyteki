class BaseStep {
    constructor(game) {
        this.game = game;
    }

    continue() {
    }

    onCardClicked() {
        return false;
    }

    onMenuCommand() {
        return false;
    }
}

module.exports = BaseStep;
