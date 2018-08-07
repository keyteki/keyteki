const BaseAction = require('./BaseAction');

class RemoveStun extends BaseAction {
    constructor(card) {
        super(card);
        this.title = 'Reap with this creature';
    }

    meetsRequirements(context = this.createContext(), ignoredRequirements = []) {
        if(!ignoredRequirements.includes('house') && context.player.activeHouse !== this.card.printedFaction) {
            return 'house';
        }
        if(!ignoredRequirements.includes('location') && context.source.location !== 'play area') {
            return 'location';
        }
        return this.card.stunned && super.meetsRequirements(context);
    }

    executeHandler(context) {
        context.game.addMessage('{0} exhausts {1} to remove its stun', context.player, context.source);
        context.source.exhaust();
        context.source.unstun();
    }
}

module.exports = RemoveStun;
