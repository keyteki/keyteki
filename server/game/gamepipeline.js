class GamePipeline {
    constructor() {
        this.pipeline = [];
        this.queue = [];
    }

    initialise(steps) {
        if (!Array.isArray(steps)) {
            steps = [steps];
        }

        this.pipeline = steps;
    }

    get length() {
        return this.pipeline.length;
    }

    getCurrentStep() {
        var step = this.pipeline[0];

        if (typeof step === 'function') {
            var createdStep = step();
            this.pipeline[0] = createdStep;
            return createdStep;
        }

        return step;
    }

    queueStep(step) {
        if (this.pipeline.length === 0) {
            this.pipeline.unshift(step);
        } else {
            var currentStep = this.getCurrentStep();
            if (currentStep.queueStep) {
                currentStep.queueStep(step);
            } else {
                this.queue.push(step);
            }
        }
    }

    cancelStep() {
        if (this.pipeline.length === 0) {
            return;
        }

        var step = this.getCurrentStep();

        if (step.cancelStep && step.isComplete) {
            step.cancelStep();
            if (!step.isComplete()) {
                return;
            }
        }

        this.pipeline.shift();
    }

    handleCardClicked(player, card) {
        if (this.pipeline.length > 0) {
            var step = this.getCurrentStep();
            if (step.onCardClicked(player, card) !== false) {
                return true;
            }
        }

        return false;
    }

    handleCardDragged(player, card, from, to) {
        if (this.pipeline.length > 0) {
            var step = this.getCurrentStep();
            if (step.onCardDragged(player, card, from, to) !== false) {
                return true;
            }
        }

        return false;
    }

    handleMenuCommand(player, arg, uuid, method) {
        if (this.pipeline.length > 0) {
            var step = this.getCurrentStep();
            if (step.onMenuCommand(player, arg, uuid, method) !== false) {
                return true;
            }
        }

        return false;
    }

    handleTideClicked(player) {
        if (this.pipeline.length > 0) {
            var step = this.getCurrentStep();
            if (step.onTideClicked(player) !== false) {
                return true;
            }
        }

        return false;
    }

    handleProphecyClicked(player, prophecyCard) {
        if (this.pipeline.length > 0) {
            var step = this.getCurrentStep();
            if (step.onProphecyClicked(player, prophecyCard) !== false) {
                return true;
            }
        }

        return false;
    }

    continue() {
        if (this.queue.length > 0) {
            this.pipeline = this.queue.concat(this.pipeline);
            this.queue = [];
        }

        while (this.pipeline.length > 0) {
            var currentStep = this.getCurrentStep();
            // Explicitly check for a return of false - if no return values is
            // defined then just continue to the next step.
            if (currentStep.continue() === false) {
                if (this.queue.length === 0) {
                    return false;
                }
            } else {
                this.pipeline = this.pipeline.slice(1);
            }

            this.pipeline = this.queue.concat(this.pipeline);
            this.queue = [];
        }

        return true;
    }

    getDebugInfo() {
        return {
            pipeline: this.pipeline.map((step) => this.getDebugInfoForStep(step)),
            queue: this.queue.map((step) => this.getDebugInfoForStep(step))
        };
    }

    getDebugInfoForStep(step) {
        let name = step.constructor.name;
        if (step.pipeline) {
            let result = {};
            result[name] = step.pipeline.getDebugInfo();
            return result;
        }

        if (step.getDebugInfo) {
            return step.getDebugInfo();
        }

        if (typeof step === 'function') {
            return step.toString();
        }

        return name;
    }

    consoleDebugInfo() {
        let pipeline = this;
        let step = pipeline.pipeline[0];
        while (step.pipeline) {
            pipeline = step.pipeline;
            step = pipeline.pipeline[0];
        }
        // console.log(pipeline.getDebugInfo());
    }
}

module.exports = GamePipeline;
