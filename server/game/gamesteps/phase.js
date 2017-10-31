const _ = require('underscore');
const BaseStepWithPipeline = require('./basestepwithpipeline.js');
const SimpleStep = require('./simplestep.js');

class Phase extends BaseStepWithPipeline {
    constructor(game, name) {
        super(game);
        this.name = name;
    }

    initialise(steps) {
        var startStep = new SimpleStep(this.game, () => this.startPhase());
        var endStep = new SimpleStep(this.game, () => this.endPhase());
        this.pipeline.initialise([startStep].concat(steps).concat([endStep]));
    }

    startPhase() {
        this.game.currentPhase = this.name;
        this.game.reapplyStateDependentEffects();
        this.game.raiseEvent('onPhaseStarted', { phase: this.name });
    }

    endPhase() {
        this.game.raiseEvent('onPhaseEnded', { phase: this.name });
        this.game.currentPhase = '';
        _.each(this.game.getPlayers(), player => {
            player.phase = '';
        });
        this.game.raiseEvent('onAtEndOfPhase');
    }
}

module.exports = Phase;
