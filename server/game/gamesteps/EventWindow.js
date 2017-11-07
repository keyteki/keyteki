const _ = require('underscore');

const BaseStepWithPipeline = require('./basestepwithpipeline.js');
const SimpleStep = require('./simplestep.js');

class EventWindow extends BaseStepWithPipeline {
    constructor(game, events) {
        super(game);

        this.events = _([]);
        _.each(events, event => this.addEvent(event));

        this.pipeline.initialise([
            new SimpleStep(game, () => this.openWindow('cancelinterrupt')),
            new SimpleStep(game, () => this.openWindow('forcedinterrupt')),
            new SimpleStep(game, () => this.openWindow('interrupt')),
            new SimpleStep(game, () => this.checkForOtherEffects()),
            new SimpleStep(game, () => this.executeHandler()),
            new SimpleStep(game, () => this.openWindow('forcedreaction')),
            new SimpleStep(game, () => this.openWindow('reaction'))
        ]);
    }

    addEvent(event) {
        event.window = this;
        this.events.push(event);
    }
    
    removeEvent(events) {
        if(!_.isArray(events)) {
            events = [events];
        }
        let uuids = events.map(event => event.uuid);
        events.each(event => event.setWindow(this));
        this.events = this.events.reject(event => uuids.includes(event.uuid));
        this.events.each(event => event.checkCondition());
    }

    openWindow(abilityType) {
        if(_.isEmpty(this.events)) {
            return;
        }

        this.game.openAbilityWindow({
            abilityType: abilityType,
            event: this.events.values()
        });
    }
    
    // This catches any persistent/delayed effect cancels
    checkForOtherEffects() {
        if(_.isEmpty(this.events)) {
            return;
        }
        
        this.events.each(event => this.game.emit(event.name + 'OtherEffects', ...event.params));
    }
    
    executeHandler() {
        if(_.isEmpty(this.events)) {
            return;
        }
        
        this.events.sortBy(event => event.order);
        this.events.each(event => event.executeHandler());
        this.events.each(event => this.game.emit(event.name, ...event.params));
    }
}

module.exports = EventWindow;
