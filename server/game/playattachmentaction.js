const BaseAbility = require('./baseability.js');
const Costs = require('./costs.js');

class PlayAttachmentAction extends BaseAbility {
    constructor() {
        super({
            cost: [
                Costs.payReduceableFateCost('play'),
                Costs.playLimited()
            ],
            target: {
                cardCondition: (card, context) => context.source.owner.canAttach(context.source, card)
            }
        });
        this.title = 'PlayAttachmentAction';
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
        context.game.addMessage('0} plays {1}, attaching it to {2}', context.player, context.source, context.target);
    }
    
    isCardPlayed() {
        return true;
    }

    isCardAbility() {
        return false;
    }
}

module.exports = PlayAttachmentAction;

