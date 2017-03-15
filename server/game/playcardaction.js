const BaseAbility = require('./baseability.js');
const Costs = require('./costs.js');

class PlayCardAction extends BaseAbility {
    constructor() {
        super({
            cost: [
                Costs.payReduceableGoldCost('play'),
                Costs.playLimited()
            ]
        });
    }

    meetsRequirements(context) {
        return (
            context.game.currentPhase !== 'setup' &&
            context.source.getType() === 'event' &&
            !context.source.cannotPlay &&
            context.player.hand.contains(context.source) &&
            context.source.canPlay(context.player, context.source)
        );
    }

    executeHandler(context) {
        context.game.addMessage('{0} plays {1} costing {2}', context.player, context.source, context.costs.gold);
        context.source.play(context.player);
        context.player.moveCard(context.source, 'discard pile');
        context.game.raiseEvent('onCardPlayed', context.player, context.source);
    }
}

module.exports = PlayCardAction;
