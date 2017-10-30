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
        this.cannotTargetFirst = false;
        this.abilityType = 'action';
        this.location = ['hand'];
    }
    
    meetsRequirements(context) {
        return (
            context.game.currentPhase !== 'dynasty' &&
            context.source.getType() === 'attachment' &&
            this.location.includes[context.source.location] &&
            context.player.canPutIntoPlay(context.source) &&
            context.source.canPlay()
        );
    }

    executeHandler(context) {
        this.originalLocation = context.source.location;
        context.player.attach(context.source, context.target);
        context.game.addMessage('{0} plays {1}, attaching it to {2}', context.player, context.source, context.target);
    }
    
    isCardPlayed() {
        return true;
    }

    isCardAbility() {
        return false;
    }
}

module.exports = PlayAttachmentAction;

