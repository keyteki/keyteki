const _ = require('underscore');

const BaseStep = require('./basestep.js');
const GamePipeline = require('../gamepipeline.js');
const SimpleStep = require('./simplestep.js');
const Event = require('../event.js');

class CardLeavesPlayEventWindow extends BaseStep {
    constructor(game, card, destination, isSacrifice) {
        super(game);

        let name = isSacrifice ? 'onCardSacrificed' : 'onCardLeavesPlay'; 
        this.characterEvent = new Event(name, { card: card }, true, () => card.owner.moveCard(card, destination));
        this.attachmentEvents = _.map(card.getEventsForDiscardingAttachments(), event => new Event(event.name, event.params, true, event.handler));

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
        if(this.characterEvent.cancelled) {
            return;
        }
        
        // Only the character event can be interrupted, but reactions can be played to attachment events
        let event = [this.characterEvent];
        if(abilityType.includes('reaction')) {
            event = event.concat(this.attachmentEvents);
        }

        this.game.openAbilityWindow({
            abilityType: abilityType,
            event: event
        });
    }

    executeHandler() {
        if(this.characterEvent.cancelled) {
            return;
        }
        
        if(!this.characterEvent.shouldSkipHandler) {
            _.each(this.attachmentEvents, event => {
                if(event.handler && !event.shouldSkipHandler) {
                    event.handler();
                }
            });

            if(this.characterEvent.handler) {
                this.characterEvent.handler();
            }
        }
        
        _.each(this.attachmentEvents, event => {
            this.game.emit(event.name, ...event.params);
        });

        this.game.emit(this.characterEvent.name, ...this.characterEvent.params);
    }
}

module.exports = CardLeavesPlayEventWindow;


