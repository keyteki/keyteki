const _ = require('underscore');

const BaseStepWithPipeline = require('./basestepwithpipeline.js');
const SimpleStep = require('./simplestep.js');

class EventWindow extends BaseStepWithPipeline {
    constructor(game, events) {
        super(game);

        this.events = [];
        _.each(events, event => this.addEvent(event));

        this.initialise();
    }

    initialise() {
        this.pipeline.initialise([
            new SimpleStep(this.game, () => this.openWindow('cancelinterrupt')),
            new SimpleStep(this.game, () => this.openWindow('forcedinterrupt')),
            new SimpleStep(this.game, () => this.openWindow('interrupt')),
            new SimpleStep(this.game, () => this.checkForOtherEffects()),
            new SimpleStep(this.game, () => this.preResolutionEffects()),
            new SimpleStep(this.game, () => this.executeHandler()),
            new SimpleStep(this.game, () => this.openWindow('forcedreaction')),
            new SimpleStep(this.game, () => this.openWindow('reaction'))
        ]);
    }

    addEvent(event) {
        event.setWindow(this);
        this.events.push(event);
    }
    
    removeEvent(events) {
        if(!_.isArray(events)) {
            events = [events];
        }
        let uuids = events.map(event => event.uuid);
        _.each(events, event => event.unsetWindow());
        this.events = _.reject(this.events, event => uuids.includes(event.uuid));
        console.log(_.pluck(this.events, 'name'))
        _.each(this.events, event => event.checkCondition());
    }

    openWindow(abilityType) {
        _.each(this.events, event => event.checkCondition());
        if(_.isEmpty(this.events)) {
            return;
        }

        this.game.openAbilityWindow({
            abilityType: abilityType,
            event: this.events
        });
    }
    
    // This catches any persistent/delayed effect cancels
    checkForOtherEffects() {
        _.each(this.events, event => this.game.emit(event.name + 'OtherEffects', ...event.params));
    }

    preResolutionEffects() {
        _.each(this.events, event => {
            event.checkCondition();
            if(!event.cancelled) {
                event.preResolutionEffect();
            }
        });
    }
    
    executeHandler() {
        this.events = _.sortBy(this.events, 'order');
        
        let thenEvents = [];

        _.each(this.events, event => {
            event.checkCondition();
            if(!event.cancelled) {
                thenEvents = thenEvents.concat(event.thenEvents);

                this.game.queueSimpleStep(() => {
                    event.executeHandler();
                    this.game.emit(event.name, ...event.params);
                });
            }
        });

        if(thenEvents.length > 0) {
            let thenEventWindow = this.game.openThenEventWindow(thenEvents);
            this.game.queueSimpleStep(() => {
                _.each(thenEventWindow.events, event => {
                    this.addEvent(event);
                });
            });
        }
    }
}

module.exports = EventWindow;
