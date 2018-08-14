const BaseAction = require('./BaseAction');

class ReapAction extends BaseAction {
    constructor(card) {
        super(card);
        this.title = 'Reap with this creature';
    }

    meetsRequirements(context = this.createContext(), ignoredRequirements = []) {
        if(!this.card.canUse(context)) {
            return 'phase';
        }
        if(!ignoredRequirements.includes('location') && context.source.location !== 'play area') {
            return 'location';
        }
        if(!ignoredRequirements.includes('stunned') && context.source.stunned) {
            return 'stunned';
        }
        if(!context.game.actions.reap().canAffect(context.source)) {
            return 'condition';
        }
        return super.meetsRequirements(context);
    }

    executeHandler(context) {
        context.game.addMessage('{0} exhausts {1} to reap, gaining 1 amber', context.player, context.source);
        context.game.actions.reap().resolve(context.source, context);
    }
}

module.exports = ReapAction;
