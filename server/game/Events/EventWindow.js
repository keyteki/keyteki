const BaseStepWithPipeline = require('../gamesteps/basestepwithpipeline.js');
const ForcedTriggeredAbilityWindow = require('../gamesteps/forcedtriggeredabilitywindow.js');
const DestroyedAbilityWindow = require('../gamesteps/DestroyedAbilityWindow.js');
const SimpleStep = require('../gamesteps/simplestep.js');

class EventWindow extends BaseStepWithPipeline {
    constructor(game, event) {
        super(game);
        this.event = event;
        this.initialise();
    }

    initialise() {
        this.pipeline.initialise([
            new SimpleStep(this.game, () => this.checkEventCondition()),
            new SimpleStep(this.game, () => this.openAbilityWindow('interrupt')),
            new SimpleStep(this.game, () => this.executeHandler()),
            new SimpleStep(this.game, () => this.checkGameState()),
            new SimpleStep(this.game, () => this.triggerConstantReactions()),
            new SimpleStep(this.game, () => this.openAbilityWindow('reaction')),
            new SimpleStep(this.game, () => this.checkNextEvents())
        ]);
    }

    checkEventCondition() {
        this.event.checkCondition();
    }

    openAbilityWindow(abilityType) {
        const events = this.event.getSimultaneousEvents();
        if(events.length === 0 || abilityType === 'reaction' && this.event.sharesReactionWindowWithEvent) {
            return;
        }

        if(abilityType === 'interrupt' && events.some(event => event.name === 'onCardDestroyed')) {
            this.queueStep(new DestroyedAbilityWindow(this.game, abilityType, this));
        } else {
            this.queueStep(new ForcedTriggeredAbilityWindow(this.game, abilityType, this));
        }
    }

    executeHandler() {
        const events = this.event.getSimultaneousEvents();
        for(let event of events) {
            // need to checkCondition here to ensure the event won't fizzle due to another event's resolution (e.g. double honoring an ordinary character with YR etc.)
            event.checkCondition();
            if(!event.cancelled) {
                event.executeHandler();
            }

            this.game.emit(event.name, event);
        }
    }

    checkGameState() {
        const events = this.event.getSimultaneousEvents();
        if(!events.every(event => event.noGameStateCheck)) {
            this.game.checkGameState(events.some(event => event.handler));
        }
    }

    triggerConstantReactions() {
        const events = this.event.getSimultaneousEvents();

        let reactionWindow = {
            addChoice: context => this.game.resolveAbility(context)
        };

        for(let event of events) {
            this.game.emit(event.name + ':constant', event, reactionWindow);
        }
    }

    checkNextEvents() {
        if(this.event.nextEvent) {
            this.queueStep(new EventWindow(this.game, this.event.nextEvent));
        }
    }
}

module.exports = EventWindow;
