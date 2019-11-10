const _ = require('underscore');

const BaseStepWithPipeline = require('../gamesteps/basestepwithpipeline.js');
const ForcedTriggeredAbilityWindow = require('../gamesteps/forcedtriggeredabilitywindow.js');
const DestroyedAbilityWindow = require('../gamesteps/DestroyedAbilityWindow.js');
const SimpleStep = require('../gamesteps/simplestep.js');

class EventWindow extends BaseStepWithPipeline {
    constructor(game, events) {
        super(game);

        this.events = [];
        this.thenAbilities = [];
        _.each(events, event => {
            if(!event.cancelled) {
                this.addEvent(event);
            }
        });

        this.initialise();
    }

    initialise() {
        this.pipeline.initialise([
            new SimpleStep(this.game, () => this.setCurrentEventWindow()),
            new SimpleStep(this.game, () => this.checkEventCondition()),
            new SimpleStep(this.game, () => this.openWindow('interrupt')),
            new SimpleStep(this.game, () => this.preResolutionEffects()),
            new SimpleStep(this.game, () => this.executeHandler()),
            new SimpleStep(this.game, () => this.checkForSubEvents()),
            new SimpleStep(this.game, () => this.checkGameState()),
            new SimpleStep(this.game, () => this.checkThenAbilities()),
            new SimpleStep(this.game, () => this.triggerConstantReactions()),
            new SimpleStep(this.game, () => this.openWindow('reaction')),
            new SimpleStep(this.game, () => this.resetCurrentEventWindow())
        ]);
    }

    addEvent(event) {
        event.setWindow(this);
        this.events.push(event);
        return event;
    }

    removeEvent(event) {
        this.events = _.reject(this.events, e => e === event);
        return event;
    }

    addThenAbility(events, ability, context) {
        if(!Array.isArray(events)) {
            events = [events];
        }

        this.thenAbilities.push({ events: events, ability: ability, context: context });
    }

    setCurrentEventWindow() {
        this.previousEventWindow = this.game.currentEventWindow;
        this.game.currentEventWindow = this;
    }

    checkEventCondition() {
        _.each(this.events, event => {
            if(!event.checkCondition()) {
                event.cancel();
            }
        });
    }

    openWindow(abilityType) {
        if(_.isEmpty(this.events)) {
            return;
        }

        if(abilityType === 'interrupt' && this.events.some(event => event.name === 'onCardDestroyed')) {
            this.queueStep(new DestroyedAbilityWindow(this.game, abilityType, this));
        } else {
            this.queueStep(new ForcedTriggeredAbilityWindow(this.game, abilityType, this));
        }
    }

    preResolutionEffects() {
        _.each(this.events, event => event.preResolutionEffect(this.game));
    }

    executeHandler() {
        this.events = _.sortBy(this.events, 'order');

        _.each(this.events, event => {
            // need to checkCondition here to ensure the event won't fizzle due to another event's resolution (e.g. double honoring an ordinary character with YR etc.)
            if(event.checkCondition()) {
                event.executeHandler();
            }

            this.game.emit(event.name, event);
        });
    }

    checkForSubEvents() {
        const subEvents = this.events.reduce((array, event) => array.concat(event.subEvents), []);
        if(subEvents.length > 0) {
            this.game.openThenEventWindow(subEvents, false);
        }
    }

    checkGameState() {
        if(!this.events.every(event => event.noGameStateCheck)) {
            this.game.checkGameState(_.any(this.events, event => event.handler), this.events);
        }
    }

    checkThenAbilities() {
        for(const thenAbility of this.thenAbilities) {
            if(thenAbility.events.every(event => !event.cancelled) || thenAbility.ability.alwaysTriggers) {
                let context = thenAbility.ability.createContext(thenAbility.context.player);
                context.preThenEvents = thenAbility.events;
                context.preThenEvent = thenAbility.events[0];
                if(!thenAbility.ability.meetsRequirements(context) && thenAbility.ability.condition(context)) {
                    this.game.resolveAbility(context);
                }
            }
        }
    }

    triggerConstantReactions() {
        let reactionWindow = {
            addChoice: context => this.game.resolveAbility(context)
        };
        _.each(this.events, event => this.game.emit(event.name + ':constant', event, reactionWindow));
    }

    resetCurrentEventWindow() {
        if(this.previousEventWindow) {
            //this.previousEventWindow.checkEventCondition();
            this.game.currentEventWindow = this.previousEventWindow;
        } else {
            this.game.currentEventWindow = null;
        }
    }
}

module.exports = EventWindow;
