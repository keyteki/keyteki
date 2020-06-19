const BaseStepWithPipeline = require('./basestepwithpipeline.js');
const SimpleStep = require('./simplestep.js');

class Phase extends BaseStepWithPipeline {
    constructor(game, name) {
        super(game);
        this.name = name;
    }

    initialise(steps) {
        this.pipeline.initialise([new SimpleStep(this.game, () => this.startPhase())]);
        this.steps = steps.concat(new SimpleStep(this.game, () => this.endPhase()));
    }

    startPhase() {
        if (
            this.game.activePlayer &&
            this.game.activePlayer.getEffects('skipStep').includes(this.name)
        ) {
            this.skipPhase();
            return;
        }

        this.game.openEventWindow(this.getPhaseStartedEvent());

        for (let step of this.steps) {
            this.game.queueStep(step);
        }
    }

    skipPhase() {}

    getPhaseStartedEvent() {
        return this.game.getEvent('onPhaseStarted', { phase: this.name }, () => {
            this.game.currentPhase = this.name;
            if (this.name !== 'setup') {
                this.game.addAlert(
                    'endofround',
                    '{0} phase - {1}',
                    this.name.charAt(0).toUpperCase() + this.name.slice(1),
                    this.game.activePlayer
                );
            }
        });
    }

    endPhase() {
        this.game.openEventWindow(this.getPhaseEndedEvent());
    }

    getPhaseEndedEvent() {
        return this.game.getEvent(
            'onPhaseEnded',
            { phase: this.name },
            () => (this.game.currentPhase = '')
        );
    }
}

module.exports = Phase;
