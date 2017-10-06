const BaseStep = require('./basestep.js');
const GamePipeline = require('../gamepipeline.js');
const SimpleStep = require('./simplestep.js');
const Event = require('../event.js');

class InitiateAbilityEventWindow extends BaseStep {
    constructor(game, params) {
        super(game);

        this.eventName = 'onCardAbilityInitated';

        this.event = new Event(this.eventName, params);
        this.pipeline = new GamePipeline();
        this.pipeline.initialise([
            new SimpleStep(game, () => this.cancelInterrupts()),
            new SimpleStep(game, () => this.reactions()),
            new SimpleStep(game, () => this.checkForOtherEffects())
        ]);
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

    onMenuCommand(player, arg, method) {
        return this.pipeline.handleMenuCommand(player, arg, method);
    }

    cancelStep() {
        this.pipeline.cancelStep();
    }

    continue() {
        return this.pipeline.continue();
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
}

module.exports = InitiateAbilityEventWindow;
