const BaseAbility = require('./baseability.js');
const Costs = require('./costs.js');

class SetupCardAction extends BaseAbility {
    constructor() {
        super({
            cost: [
                Costs.payPrintedGoldCost(),
                Costs.playLimited()
            ]
        });
    }

    meetsRequirements(context) {
        return (
            context.game.currentPhase === 'setup' &&
            context.player.hand.contains(context.source) &&
            context.source.getType() !== 'event'
        );
    }

    executeHandler(context) {
        context.player.putIntoPlay(context.source, 'setup');
    }
}

module.exports = SetupCardAction;
