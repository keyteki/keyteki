const BaseAction = require('./BaseAction');

class DiscardAction extends BaseAction {
    constructor(card) {
        super(card);
        this.title = 'Discard this card';
    }

    meetsRequirements(context = this.createContext(), ignoredRequirements = []) {
        if(!ignoredRequirements.includes('house') && !this.card.hasHouse(context.player.activeHouse)) {
            return 'house';
        }
        if(!ignoredRequirements.includes('location') && !context.player.isCardInPlayableLocation(context.source, 'play')) {
            return 'location';
        }
        return super.meetsRequirements(context);
    }

    executeHandler(context) {
        context.player.moveCard(context.source, 'discard');
        context.game.addMessage('{0} discards {1}', context.player, context.source);
    }
}

module.exports = DiscardAction;
