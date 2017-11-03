const BaseAbility = require('./baseability.js');
const Costs = require('./costs.js');

class PlayCardAction extends BaseAbility {
    constructor() {
        super({
            cost: Costs.playEvent()
        });
        this.title = 'Play';
    }

    meetsRequirements(context) {
        return (
            context.game.currentPhase !== 'setup' &&
            context.source.getType() === 'event' &&
            context.source.abilities.actions.length === 0 &&
            context.source.abilities.reactions.length === 0 &&
            context.player.isCardInPlayableLocation(context.source, 'play') &&
            context.source.canPlay(context.player, context.source)
        );
    }

    executeHandler(context) {
        this.originalLocation = context.source.location;
        context.game.addMessage('{0} plays {1} costing {2}', context.player, context.source, context.costs.gold);
        context.source.play(context.player);
    }

    isCardPlayed() {
        return true;
    }
}

module.exports = PlayCardAction;
