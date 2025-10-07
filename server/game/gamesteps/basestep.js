class BaseStep {
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

export default BaseStep;
