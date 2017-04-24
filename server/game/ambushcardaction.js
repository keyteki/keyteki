const BaseAbility = require('./baseability.js');
const Costs = require('./costs.js');

class AmbushCardAction extends BaseAbility {
    constructor() {
        super({
            cost: [
                Costs.payReduceableGoldCost('ambush'),
                Costs.playLimited()
            ]
        });
        this.title = 'Ambush';
    }

    meetsRequirements(context) {
        return (
            context.game.currentPhase === 'challenge' &&
            context.source.isAmbush() &&
            context.player.isCardInPlayableLocation(context.source, 'ambush') &&
            context.player.canPutIntoPlay(context.source) &&
            context.source.getType() !== 'event'
        );
    }

    executeHandler(context) {
        if(context.costs.isDupe) {
            context.game.addMessage('{0} duplicates {1} costing {2}', context.player, context.source, context.costs.gold);
        } else {
            context.game.addMessage('{0} ambushes with {1} costing {2}', context.player, context.source, context.costs.gold);
        }
        context.player.putIntoPlay(context.source, 'ambush');
    }
}

module.exports = AmbushCardAction;
