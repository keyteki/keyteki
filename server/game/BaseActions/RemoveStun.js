const BaseAction = require('./BaseAction');

class RemoveStun extends BaseAction {
    constructor(card) {
        super(card);
        this.title = 'Remove this creature\'s stun';
    }

    meetsRequirements(context = this.createContext(), ignoredRequirements = []) {
        if(!this.card.canUse(context)) {
            return 'cannotTrigger';
        }
        if(!ignoredRequirements.includes('location') && context.source.location !== 'play area') {
            return 'location';
        }
        if(!this.card.stunned) {
            return 'condition';
        }
        return super.meetsRequirements(context);
    }

    executeHandler(context) {
        context.game.cardsUsed.push(context.source);
        context.game.addMessage('{0} exhausts {1} to remove its stun', context.player, context.source);
        context.source.exhaust();
        context.source.unstun();
    }
}

module.exports = RemoveStun;
