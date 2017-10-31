const _ = require('underscore');

const BaseStepWithPipeline = require('./basestepwithpipeline.js');
const SimpleStep = require('./simplestep.js');
const Event = require('../event.js');

class CardLeavesPlayEventWindow extends BaseStepWithPipeline {
    constructor(game, card, destination, isSacrifice) {
        super(game);

        this.characterEvent = new Event('onCardLeavesPlay', { card: card, destination: destination }, () => card.owner.moveCard(card, destination));
        this.attachmentEvents = _.map(card.getEventsForDiscardingAttachments(), event => new Event(event.name, event.params, event.handler));
        if(isSacrifice) {
            this.sacrificeEvent = new Event('onCardSacrificed', { card: card });
        }

        this.pipeline.initialise([
            new SimpleStep(game, () => this.openWindow('cancelinterrupt')),
            new SimpleStep(game, () => this.openWindow('forcedinterrupt')),
            new SimpleStep(game, () => this.openWindow('interrupt')),
            new SimpleStep(game, () => this.executeHandler()),
            new SimpleStep(game, () => this.openWindow('forcedreaction')),
            new SimpleStep(game, () => this.openWindow('reaction'))
        ]);
    }

    openWindow(abilityType) {
        if(this.characterEvent.cancelled) {
            return;
        }
        
        // Only the character event can be interrupted, but reactions can be played to attachment (and sacrifice) events
        let event = [this.characterEvent];
        if(abilityType.includes('reaction')) {
            event = event.concat(this.attachmentEvents);
            if(this.sacrificeEvent) {
                event = event.concat([this.sacrificeEvent]);
            }
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
        
        _.each(this.attachmentEvents, event => {
            if(event.handler) {
                event.handler(...event.params);
            }
        });

        if(this.characterEvent.handler) {
            this.characterEvent.handler(...this.characterEvent.params);
        }
        
        _.each(this.attachmentEvents, event => {
            this.game.emit(event.name, ...event.params);
        });

        this.game.emit(this.characterEvent.name, ...this.characterEvent.params);
        
        if(this.sacrificeEvent) {
            this.game.emit(this.sacrificeEvent.name, ...this.sacrificeEvent.params);
        }
    }
}

module.exports = CardLeavesPlayEventWindow;


