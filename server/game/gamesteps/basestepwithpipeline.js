const BaseStep = require('./basestep.js');
const GamePipeline = require('../gamepipeline.js');

class BaseStepWithPipeline extends BaseStep {
    constructor(game) {
        super(game);
        this.pipeline = new GamePipeline();

    }

    queueStep(step) {
        this.pipeline.queueStep(step);
    }

    isComplete() {
        return this.pipeline.length === 0;
    }

    onCardClicked(player, card) {
        return this.pipeline.handleCardClicked(player, card);
    }

    onRingClicked(player, ring) {
        return this.pipeline.handleRingClicked(player, ring);
    }

    onMenuCommand(player, arg, uuid, method) {
        return this.pipeline.handleMenuCommand(player, arg, uuid, method);
    }

    cancelStep() {
        this.pipeline.cancelStep();
    }

    continue() {
        try {
            return this.pipeline.continue();
        } catch(e) {
            this.game.reportError(e);
            return true;
        }
    }
}

module.exports = BaseStepWithPipeline;
