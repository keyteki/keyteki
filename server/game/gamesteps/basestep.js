class BaseStep {
    constructor(game) {
        this.game = game;
    }

    continue() {
    }

    onCardClicked() {
        return false;
    }

    onRingClicked() {
        return false;
    }

    onMenuCommand() {
        return false;
    }

    getDebugInfo() {
        return this.constructor.name;
    }
}

module.exports = BaseStep;
