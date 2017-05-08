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
            !context.source.cannotPlay &&
            context.player.isCardInPlayableLocation(context.source, 'play') &&
            context.source.canPlay(context.player, context.source)
        );
    }

    executeHandler(context) {
        context.game.raiseMergedEvent('onBeforeCardPlayed', { player: context.player, source: context.source }, (event) => {
            context.game.addMessage('{0} plays {1} costing {2}', event.player, event.source, context.costs.gold);
            context.source.play(event.player);
            context.player.moveCard(event.source, 'discard pile');
            context.game.raiseEvent('onCardPlayed', event.player, event.source);
        });
    }
}

module.exports = PlayCardAction;
