const BaseAbility = require('./baseability.js');
const Costs = require('./costs.js');

class PlayAttachmentAction extends BaseAbility {
    constructor() {
        super({
            cost: [
                Costs.payReduceableFateCost('play'),
                Costs.playLimited(),
                Costs.useInitiateAction()
            ],
            target: { 
                cardCondition: (card, context) => context.source.owner.canAttach(context.source, card)
            }
        });
        this.title = 'Play this attachment';
        this.cannotTargetFirst = false;
        this.abilityType = 'action';
        this.location = ['hand'];
        this.cannotBeCancelled = true;
    }
    
    meetsRequirements(context) {
        return (
            context.game.currentPhase !== 'dynasty' &&
            context.source.getType() === 'attachment' &&
            this.location.includes(context.source.location) &&
            context.player.canPutIntoPlay(context.source) &&
            context.source.canPlay() &&
            this.canResolveTargets(context)
        );
    }

    executeHandler(context) {
        this.originalLocation = context.source.location;
        context.player.attach(context.source, context.target, true);
        context.game.addMessage('{0} plays {1}, attaching it to {2}', context.player, context.source, context.target);
    }
    
    isCardPlayed() {
        return true;
    }
}

module.exports = PlayAttachmentAction;

