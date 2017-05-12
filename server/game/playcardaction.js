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
        this.title = 'Play';
    }

    meetsRequirements(context) {
        return (
            context.game.currentPhase !== 'setup' &&
            context.source.getType() === 'event' &&
            context.source.abilities.actions.length === 0 &&
            context.source.canBePlayed() &&
            context.player.isCardInPlayableLocation(context.source, 'play') &&
            context.source.canPlay(context.player, context.source)
        );
    }

    executeHandler(context) {
        context.game.addMessage('{0} plays {1} costing {2}', context.player, context.source, context.costs.gold);
        context.source.play(context.player);
        context.player.moveCard(context.source, 'discard pile');
    }

    isPlayableEventAbility() {
        return true;
    }
}

module.exports = PlayCardAction;
