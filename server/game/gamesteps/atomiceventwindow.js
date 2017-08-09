const _ = require('underscore');

const BaseStep = require('./basestep.js');
const GamePipeline = require('../gamepipeline.js');
const SimpleStep = require('./simplestep.js');
const Event = require('../event.js');

class AtomicEventWindow extends BaseStep {
    constructor(game, eventProperties, handler) {
        super(game);

        this.events = _.map(eventProperties, event => new Event(event.name, event.params, true));
        this.handler = handler || (() => true);

        this.pipeline = new GamePipeline();
        this.pipeline.initialise([
            new SimpleStep(game, () => this.openWindow('cancelinterrupt')),
            new SimpleStep(game, () => this.openWindow('forcedinterrupt')),
            new SimpleStep(game, () => this.openWindow('interrupt')),
            new SimpleStep(game, () => this.executeHandler()),
            new SimpleStep(game, () => this.openWindow('forcedreaction')),
            new SimpleStep(game, () => this.openWindow('reaction'))
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

    onMenuCommand(player, arg, method) {
        return this.pipeline.handleMenuCommand(player, arg, method);
    }

    cancelStep() {
        this.pipeline.cancelStep();
    }

    continue() {
        return this.pipeline.continue();
    }

    openWindow(abilityType) {
        this.filterOutCancelledEvents();

        if(_.isEmpty(this.events)) {
            return;
        }

        this.game.openAbilityWindow({
            abilityType: abilityType,
            event: this.events
        });
    }

    filterOutCancelledEvents() {
        this.events = _.reject(this.events, event => event.cancelled);
    }

    executeHandler() {
        this.filterOutCancelledEvents();

        if(_.isEmpty(this.events)) {
            return;
        }

        if(_.all(this.events, event => !event.shouldSkipHandler)) {
            this.handler();
        }

        _.each(this.events, event => {
            this.game.emit(event.name, ...event.params);
        });
    }
}

module.exports = AtomicEventWindow;
