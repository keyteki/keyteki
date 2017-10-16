const BaseAbility = require('./baseability.js');
const Costs = require('./costs.js');
const ChooseFate = require('./costs/choosefate.js');

class DynastyCardAction extends BaseAbility {
    constructor() {
        super({
            cost: [
                new ChooseFate(),
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
            !source.facedown &&
            source.getType() === 'character' &&
            player.isCardInPlayableLocation(source, 'dynasty') &&
            player.canPutIntoPlay(source) &&
            source.canPlay()
        );
    }

    executeHandler(context) {
        
        context.source.fate = this.cost[0].fate;
        context.player.putIntoPlay(context.source);
        
        context.game.addMessage('{0} plays {1} with {2} additional fate', context.player, context.source, this.cost[0].fate);
    }

    isCardPlayed() {
        return true;
    }

    isCardAbility() {
        return false;
    }
}

module.exports = DynastyCardAction;
