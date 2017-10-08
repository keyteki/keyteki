const BaseAbility = require('./baseability.js');
const Costs = require('./costs.js');

class PlayAttachmentAction extends BaseAbility {
    constructor() {
        super({
            cost: [
                Costs.payReduceableFateCost('play'),
                Costs.playLimited()
            ] 
        });
        this.title = 'PlayAttachmentAction';
        this.targets = { 
            target: {
                cardCondition: this.cardCondition
            }
        };
    }
    
    cardCondition(card, context) {
        return context.player.canAttach(context.source, card);
    }

    meetsRequirements(context) {
        return (
            context.game.currentPhase !== 'dynasty' &&
            context.source.getType() === 'attachment' &&
            context.source.location === 'hand' &&
            context.source.canPlay()
        );
    }

    executeHandler(context) {
        context.player.attach(context.source, context.target);
    }

    isCardAbility() {
        return false;
    }
}

module.exports = PlayAttachmentAction;

