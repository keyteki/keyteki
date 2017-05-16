const _ = require('underscore');

const BaseStep = require('./basestep.js');
const GamePipeline = require('../gamepipeline.js');
const SimpleStep = require('./simplestep.js');
const Event = require('../event.js');

class SimultaneousEventWindow extends BaseStep {
    constructor(game, cards, properties) {
        super(game);

        this.handler = properties.handler || (() => true);

        this.event = new Event(properties.eventName, _.extend({ cards: cards }, properties.params), true);
        this.perCardEventMap = this.buildPerCardEvents(cards, properties);
        this.perCardHandler = properties.perCardHandler || (() => true);
        this.pipeline = new GamePipeline();
        this.pipeline.initialise([
            new SimpleStep(game, () => this.openWindow('cancelinterrupt')),
            new SimpleStep(game, () => this.perCardWindow('cancelinterrupt')),
            new SimpleStep(game, () => this.openWindow('forcedinterrupt')),
            new SimpleStep(game, () => this.perCardWindow('forcedinterrupt')),
            new SimpleStep(game, () => this.openWindow('interrupt')),
            new SimpleStep(game, () => this.perCardWindow('interrupt')),
            new SimpleStep(game, () => this.executeHandler()),
            new SimpleStep(game, () => this.executePerCardHandlers()),
            new SimpleStep(game, () => this.openWindow('forcedreaction')),
            new SimpleStep(game, () => this.perCardWindow('forcedreaction')),
            new SimpleStep(game, () => this.openWindow('reaction')),
            new SimpleStep(game, () => this.perCardWindow('reaction'))
        ]);
    }

    buildPerCardEvents(cards, properties) {
        let eventMap = {};
        _.each(cards, card => {
            let perCardParams = _.extend({ card: card }, properties.params);
            eventMap[card.uuid] = new Event(properties.perCardEventName, perCardParams, true);
        });
        return eventMap;
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
        if(this.event.cancelled) {
            return;
        }

        this.game.openAbilityWindow({
            abilityType: abilityType,
            event: this.event
        });
    }

    perCardWindow(abilityType) {
        if(this.event.cancelled) {
            return;
        }

        this.filterOutCancelledEvents();
        _.each(this.event.cards, card => {
            let event = this.perCardEventMap[card.uuid];
            this.game.openAbilityWindow({
                abilityType: abilityType,
                event: event
            });
        });
    }

    filterOutCancelledEvents() {
        this.perCardEventMap = _.pick(this.perCardEventMap, event => this.event.cards.includes(event.card) && !event.cancelled);
    }

    executeHandler() {
        if(this.event.cancelled) {
            return;
        }

        this.executeEventHandler(this.event, this.handler);
    }

    executePerCardHandlers() {
        if(this.event.cancelled) {
            return;
        }

        this.filterOutCancelledEvents();

        _.each(this.event.cards, card => {
            let event = this.perCardEventMap[card.uuid];

            if(!event) {
                return;
            }

            this.game.queueSimpleStep(() => {
                this.executeEventHandler(event, this.perCardHandler);
            });
        });
    }

    executeEventHandler(event, handler) {
        if(!event.shouldSkipHandler) {
            handler(...event.params);

            if(event.cancelled) {
                return;
            }
        }
        this.game.emit(event.name, ...event.params);
    }
}

module.exports = SimultaneousEventWindow;
