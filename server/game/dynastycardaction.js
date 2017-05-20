const BaseAbility = require('./baseability.js');
const Costs = require('./costs.js');

class DynastyCardAction extends BaseAbility {
    constructor() {
        super({
            cost: [
                Costs.payReduceableGoldCost('dynasty'),
                Costs.playLimited()
            ]
        });
        this.title = 'Dynasty';
    }

    meetsRequirements(context) {
        var {game, player, source} = context;

        return (
            game.currentPhase === 'dynasty' &&
            source.canBedynastyed() &&
            source.getType() !== 'event' &&
            player.isCardInPlayableLocation(source, 'dynasty') &&
            player.canPutIntoPlay(source)
        );
    }

    executeHandler(context) {
        if(context.costs.isDupe) {
            context.game.addMessage('{0} duplicates {1} for free', context.player, context.source);
        } else {
            context.game.addMessage('{0} dynastys {1} costing {2}', context.player, context.source, context.costs.gold);
        }
        context.player.putIntoPlay(context.source, 'dynasty');
    }

    isCardAbility() {
        return false;
    }
}

module.exports = DynastyCardAction;
