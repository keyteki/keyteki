const BaseStepWithPipeline = require('./basestepwithpipeline.js');
const SimpleStep = require('./simplestep.js');
const Event = require('../event.js');

class InitiateAbilityEventWindow extends BaseStepWithPipeline {
    constructor(game, params, handler) {
        super(game);

        this.eventName = 'onCardAbilityInitiated';

        this.event = new Event(this.eventName, params, handler);
        this.pipeline.initialise([
            new SimpleStep(game, () => this.cancelInterrupts()),
            new SimpleStep(game, () => this.checkForOtherEffects()),
            new SimpleStep(game, () => this.executeHandler())
        ]);
    }

    cancelInterrupts() {
        this.game.openAbilityWindow({
            abilityType: 'cancelinterrupt',
            event: this.event
        });
    }

    checkForOtherEffects() {
        // Kisada needs to see the cancelled event so he knows that he can't cancel the next one
        /* 
        if(this.event.cancelled) {
            return;
        }*/
        
        this.game.emit(this.eventName + 'OtherEffects', ...this.event.params);
    }

    executeHandler() {
        if(this.event.cancelled) {
            return;
        }

        this.event.handler(...this.event.params);

        if(!this.event.cancelled) {
            this.game.emit(this.eventName, ...this.event.params);
        }
    }
}

module.exports = InitiateAbilityEventWindow;
