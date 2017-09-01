const BaseAbility = require('./baseability.js');
const Costs = require('./costs.js');

class DynastyCardAction extends BaseAbility {
    constructor() {
        super({
            cost: [
                Costs.payReduceableFateCost('dynasty'),
                Costs.playLimited()
            ]
        });
        this.title = 'Dynasty';
    }

    meetsRequirements(context) {
        var {game, player, source} = context;

        return (
            game.currentPhase === 'dynasty' &&
            source.isDynasty &&
            source.getType() !== 'event' &&
            player.isCardInPlayableLocation(source, 'dynasty') &&
            player.canPutIntoPlay(source)
        );
    }

    executeHandler(context) {
        context.game.addMessage('{0} dynastys {1} costing {2}', context.player, context.source, context.costs.gold);

        context.player.putIntoPlay(context.source, 'dynasty');
    }

    isCardAbility() {
        return false;
    }
}

module.exports = DynastyCardAction;
