const BaseStep = require('./basestep.js');
const GamePipeline = require('../gamepipeline.js');
const SimpleStep = require('./simplestep.js');
const Event = require('../event.js');

class EventWindow extends BaseStep {
    constructor(game, eventName, params, handler) {
        super(game);

        this.eventName = eventName;
        this.params = params;
        this.handler = handler;

        this.event = new Event(eventName, params);
        this.pipeline = new GamePipeline();
        this.pipeline.initialise([
            new SimpleStep(game, () => this.cancelInterrupts()),
            new SimpleStep(game, () => this.forcedInterrupts()),
            new SimpleStep(game, () => this.interrupts()),
            new SimpleStep(game, () => this.executeHandler()),
            new SimpleStep(game, () => this.forcedReactions()),
            new SimpleStep(game, () => this.reactions())
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
        return this.event.cancelled || this.pipeline.continue();
    }

    cancelInterrupts() {
        this.game.emit(this.eventName + ':cancelinterrupt', this.event, ...this.params);
    }

    forcedInterrupts() {
        this.game.emit(this.eventName + ':forcedinterrupt', this.event, ...this.params);
    }

    interrupts() {
        this.game.emit(this.eventName + ':interrupt', this.event, ...this.params);
    }

    executeHandler() {
        if(!this.event.shouldSkipHandler) {
            this.handler();
        }
        this.game.emit(this.eventName, this.event, ...this.params);
    }

    forcedReactions() {
        this.game.emit(this.eventName + ':forcedreaction', this.event, ...this.params);
    }

    reactions() {
        this.game.emit(this.eventName + ':reaction', this.event, ...this.params);
    }
}

module.exports = EventWindow;
