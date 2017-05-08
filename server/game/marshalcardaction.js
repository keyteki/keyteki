const BaseAbility = require('./baseability.js');
const Costs = require('./costs.js');

class MarshalCardAction extends BaseAbility {
    constructor() {
        super({
            cost: [
                Costs.payReduceableGoldCost('marshal'),
                Costs.playLimited()
            ]
        });
        this.title = 'Marshal';
    }

    meetsRequirements(context) {
        var {game, player, source} = context;

        return (
            game.currentPhase === 'marshal' &&
            source.canBeMarshaled() &&
            source.getType() !== 'event' &&
            player.isCardInPlayableLocation(source, 'marshal') &&
            player.canPutIntoPlay(source)
        );
    }

    executeHandler(context) {
        if(context.costs.isDupe) {
            context.game.addMessage('{0} duplicates {1} for free', context.player, context.source);
        } else {
            context.game.addMessage('{0} marshals {1} costing {2}', context.player, context.source, context.costs.gold);
        }
        context.player.putIntoPlay(context.source, 'marshal');
    }
}

module.exports = MarshalCardAction;
