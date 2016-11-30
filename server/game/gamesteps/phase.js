const _ = require('underscore');
const BaseStep = require('./basestep.js');
const GamePipeline = require('../gamepipeline.js');

class Phase extends BaseStep {
    constructor(game) {
        super(game);
        this.pipeline = new GamePipeline();
    }

    initialise(steps) {
        this.pipeline.initialise(steps);
    }

    isComplete() {
        return this.pipeline.length === 0;
    }

    onCardClicked(player, card) {
        return this.pipeline.handleCardClicked(player, card);
    }

    onMenuCommand(player, arg, method) {
        return this.pipeline.handleMenuCommand(player, arg, method);
    }

    cancelStep() {
        this.pipeline.cancelStep();
    }

    continue() {
        return this.pipeline.continue();
    }
}

module.exports = Phase;
