class BaseStep {
    /**
     * @param {import('../game')} game
     */
    constructor(game) {
        this.game = game;
    }

    continue() {}

    onCardClicked() {
        return false;
    }

    onCardDragged() {
        return false;
    }

    onTideClicked() {
        return false;
    }

    onProphecyClicked() {
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
