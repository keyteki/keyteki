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
            new SimpleStep(this.game, () => this.setCurrentEventWindow()),
            new SimpleStep(this.game, () => this.checkEventCondition()),
            new SimpleStep(this.game, () => this.openWindow('cancelinterrupt')),
            new SimpleStep(this.game, () => this.createContigentEvents()),
            new SimpleStep(this.game, () => this.openWindow('forcedinterrupt')),
            new SimpleStep(this.game, () => this.openWindow('interrupt')),
            new SimpleStep(this.game, () => this.checkForOtherEffects()),
            new SimpleStep(this.game, () => this.preResolutionEffects()),
            new SimpleStep(this.game, () => this.executeHandler()),
            new SimpleStep(this.game, () => this.openWindow('forcedreaction')),
            new SimpleStep(this.game, () => this.openWindow('reaction')),
            new SimpleStep(this.game, () => this.resetCurrentEventWindow())
        ]);
    }

    addEvent(event) {
        event.setWindow(this);
        this.events.push(event);
    }
    
    removeEvent(event) {
        this.events = _.reject(this.events, e => e === event);
    }

    setCurrentEventWindow() {
        this.previousEventWindow = this.game.currentEventWindow;
    }

    checkEventCondition() {
        _.each(this.events, event => event.checkCondition());
    }

    openWindow(abilityType) {
        if(_.isEmpty(this.events)) {
            return;
        }

        this.game.openAbilityWindow({
            abilityType: abilityType,
            event: this.events
        });
    }

    // This is primarily for LeavesPlayEvents
    createContigentEvents() {
        let contingentEvents = [];
        _.each(this.events, event => {
            contingentEvents = contingentEvents.concat(event.createContingentEvents());
        });
        if(contingentEvents.length > 0) {
            _.each(contingentEvents, event => this.addEvent(event));
            this.game.openAbilityWindow({
                abilityType: 'cancelinterrupt',
                event: contingentEvents
            });
        }
    }
    
    // This catches any persistent/delayed effect cancels
    checkForOtherEffects() {
        _.each(this.events, event => this.game.emit(event.name + 'OtherEffects', event));
    }

    preResolutionEffects() {
        _.each(this.events, event => event.preResolutionEffect());
    }
    
    executeHandler() {
        this.events = _.sortBy(this.events, 'order');
        
        let thenEvents = [];

        _.each(this.events, event => {
            thenEvents = thenEvents.concat(event.thenEvents);
            event.executeHandler();
            this.game.emit(event.name, event);
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

    resetCurrentEventWindow() {
        if(this.previousEventWindow) {
            this.previousEventWindow.checkEventCondition();
            this.game.currentEventWindow = this.previousEventWindow;
        } else {
            this.game.currentEventWindow = null;
        }
    }
}

module.exports = EventWindow;
