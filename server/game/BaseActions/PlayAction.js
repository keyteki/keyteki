const BaseAction = require('./BaseAction');

class PlayAction extends BaseAction {
    constructor(card) {
        super(card);
        this.title = 'Play this action';
    }

    meetsRequirements(context = this.createContext(), ignoredRequirements = []) {
        if(!ignoredRequirements.includes('house') && context.player.activeHouse !== this.card.printedFaction) {
            return 'phase';
        }
        if(!ignoredRequirements.includes('location') && !context.player.isCardInPlayableLocation(context.source, 'play')) {
            return 'location';
        }
        if(!ignoredRequirements.includes('cannotTrigger') && !context.source.canPlay(context)) {
            return 'cannotTrigger';
        }
        return super.meetsRequirements(context);
    }

    executeHandler(context) {
        let location = context.source.location;
        context.game.cardsUsed.push(context.source);
        context.player.moveCard(context.source, 'being played');
        let amberMsg = context.source.printedAmber > 0 ? ', gaining ' + context.source.printedAmber.toString() + ' amber' : '';
        context.player.modifyAmber(context.source.printedAmber);
        context.game.addMessage('{0} plays {1}{2}', context.player, context.source, amberMsg);
        context.game.raiseEvent('onCardPlayed', {
            player: context.player,
            card: context.source,
            originalLocation: location
        });
        context.game.queueSimpleStep(() => context.source.owner.moveCard(context.source, 'discard'));
    }

    isCardPlayed() {
        return true;
    }
}

module.exports = PlayAction;
