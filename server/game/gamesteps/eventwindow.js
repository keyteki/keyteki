const BaseStepWithPipeline = require('./basestepwithpipeline.js');
const SimpleStep = require('./simplestep.js');
const Event = require('../event.js');

class EventWindow extends BaseStepWithPipeline {
    constructor(game, eventName, params, handler) {
        super(game);

        this.eventName = eventName;

        this.event = new Event(eventName, params, handler);
        this.pipeline.initialise([
            new SimpleStep(game, () => this.cancelInterrupts()),
            new SimpleStep(game, () => this.forcedInterrupts()),
            new SimpleStep(game, () => this.interrupts()),
            new SimpleStep(game, () => this.checkForOtherEffects()),
            new SimpleStep(game, () => this.executeHandler()),
            new SimpleStep(game, () => this.forcedReactions()),
            new SimpleStep(game, () => this.reactions())
        ]);
    }

    cancelInterrupts() {
        this.game.openAbilityWindow({
            abilityType: 'cancelinterrupt',
            event: this.event
        });
    }

    forcedInterrupts() {
        if(this.event.cancelled) {
            return;
        }

        this.game.openAbilityWindow({
            abilityType: 'forcedinterrupt',
            event: this.event
        });
    }

    interrupts() {
        if(this.event.cancelled) {
            return;
        }

        this.game.openAbilityWindow({
            abilityType: 'interrupt',
            event: this.event
        });
    }
    
    checkForOtherEffects() {
        if(this.event.cancelled) {
            return;
        }
        
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

    forcedReactions() {
        if(this.event.cancelled) {
            return;
        }

        this.game.openAbilityWindow({
            abilityType: 'forcedreaction',
            event: this.event
        });
    }

    reactions() {
        if(this.event.cancelled) {
            return;
        }

        this.game.openAbilityWindow({
            abilityType: 'reaction',
            event: this.event
        });
    }
}

module.exports = EventWindow;
