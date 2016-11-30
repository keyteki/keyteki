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

    queueStep(step) {
        if(this.pipeline.length === 0) {
            this.pipeline.unshift(step);
        } else {
            this.queue.push(step);
        }
    }

    cancelStep() {
        if(this.pipeline.length === 0) {
            return;
        }

        var step = this.pipeline[0];
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
            var step = _.first(this.pipeline);
            if(step.onCardClicked(player, card) !== false) {
                return true;
            }
        }

        return false;
    }

    handleMenuCommand(player, arg, method) {
        if(this.pipeline.length > 0) {
            var step = _.first(this.pipeline);
            if(step.onMenuCommand(player, arg, method) !== false) {
                return true;
            }
        }

        return false;
    }

    continue() {
        while(this.pipeline.length > 0) {
            var currentStep = _.first(this.pipeline);

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
