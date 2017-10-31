const BaseStepWithPipeline = require('./basestepwithpipeline.js');
const SimpleStep = require('./simplestep.js');
const Event = require('../event.js');

class InitiateAbilityEventWindow extends BaseStepWithPipeline {
    constructor(game, params) {
        super(game);

        this.eventName = 'onCardAbilityInitiated';

        this.event = new Event(this.eventName, params);
        this.pipeline.initialise([
            new SimpleStep(game, () => this.cancelInterrupts()),
            new SimpleStep(game, () => this.raiseCardPlayed()),
            new SimpleStep(game, () => this.checkForOtherEffects()),
            new SimpleStep(game, () => this.passCancelThroughToResolver())
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
        // Kisada needs to see the cancelled event so he knows that he can't cancel the next one
        /* 
        if(this.event.cancelled) {
            return;
        }*/
        
        this.game.emit(this.eventName + 'OtherEffects', ...this.event.params);
    }

    forcedReactions() {
        this.game.openAbilityWindow({
            abilityType: 'forcedreaction',
            event: this.event
        });
    }

    reactions() {
        this.game.openAbilityWindow({
            abilityType: 'reaction',
            event: this.event
        });
    }
    
    raiseCardPlayed() {
        if(this.event.resolver.context.ability.isCardPlayed()) {
            this.game.raiseEvent('onCardPlayed', { 
                player: this.event.resolver.context.player, 
                card: this.event.resolver.context.source, 
                originalLocation: this.event.resolver.context.ability.originalLocation
            });
        }
    }

    passCancelThroughToResolver() {
        if(this.event.cancelled) {
            this.event.resolver.cancelled = true;
        }
    }
}

module.exports = InitiateAbilityEventWindow;
