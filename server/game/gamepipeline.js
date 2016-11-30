const _ = require('underscore');

class GamePipeline {
    constructor() {
        this.pipeline = [];
        this.queue = [];
    }

    initialise(steps) {
        if(!_.isArray(steps)) {
            steps = [steps];
        }

        this.pipeline = steps;
    }

    get length() {
        return this.pipeline.length;
    }

    getCurrentStep() {
        var step = _.first(this.pipeline);

        if(_.isFunction(step)) {
            var createdStep = step();
            this.pipeline[0] = createdStep;
            return createdStep;
        }

        return step;
    }

    queueStep(step) {
        if(this.pipeline.length === 0) {
            this.pipeline.unshift(step);
        } else {
            var currentStep = this.getCurrentStep();
            if(currentStep.queueStep) {
                currentStep.queueStep(step);
            } else {
                this.queue.push(step);
            }
        }
    }

    cancelStep() {
        if(this.pipeline.length === 0) {
            return;
        }

        var step = this.getCurrentStep();

        if(step.cancelStep && step.isComplete) {
            step.cancelStep();
            if(!step.isComplete()) {
                return;
            }
        }

        this.pipeline.shift();
    }

    handleCardClicked(player, card) {
        if(this.pipeline.length > 0) {
            var step = this.getCurrentStep();
            if(step.onCardClicked(player, card) !== false) {
                return true;
            }
        }

        return false;
    }

    handleMenuCommand(player, arg, method) {
        if(this.pipeline.length > 0) {
            var step = this.getCurrentStep();
            if(step.onMenuCommand(player, arg, method) !== false) {
                return true;
            }
        }

        return false;
    }

    continue() {
        while(this.pipeline.length > 0) {
            var currentStep = this.getCurrentStep();

            // Explicitly check for a return of false - if no return values is
            // defined then just continue to the next step.
            if(currentStep.continue() === false) {
                if(this.queue.length === 0) {
                    return false;
                }
            } else {
                this.pipeline = _.rest(this.pipeline, 1);
            }
            this.pipeline = this.queue.concat(this.pipeline);
            this.queue = [];
        }
        return true;
    }
}

module.exports = GamePipeline;
