const BaseAction = require('./BaseAction');

class PlayCreatureAction extends BaseAction {
    constructor(card) {
        super(card);
        this.title = 'Play this creature';
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
        let cardPlayedEvent = context.game.getEvent('onCardPlayed', {
            player: context.player,
            card: context.source,
            originalLocation: context.source.location
        });
        let amberMsg = context.source.printedAmber > 0 ? ', gaining ' + context.source.printedAmber.toString() + ' amber' : '';
        context.game.addMessage('{0} plays {1}{2}', context.player, context.source, amberMsg);
        context.game.openEventWindow([context.game.actions.putIntoPlay().getEvent(context.source, context), cardPlayedEvent]);
    }

    isCardPlayed() {
        return true;
    }
}

module.exports = PlayCreatureAction;

