const BaseAction = require('./BaseAction');
const AttachAction = require('../GameActions/AttachAction');

class PlayUpgradeAction extends BaseAction {
    constructor(card) {
        super(card, {
            gameAction: new AttachAction(context => ({ upgrade: context.source }))
        });
        this.title = 'Play this upgrade';
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

    displayMessage(context) {
        let amberMsg = context.source.printedAmber > 0 ? ', gaining ' + context.source.printedAmber.toString() + ' amber' : '';
        context.player.modifyAmber(context.source.printedAmber);
        if(context.target) {
            context.game.addMessage('{0} plays {1}{2}{3} attaching it to {4}', context.player, context.source, amberMsg, context.source.printedAmber > 0 ? '' : ',', context.target);
        } else {
            context.game.addMessage('{0} plays {1}{2} and it is discarded', context.player, context.source, amberMsg);
        }
    }

    executeHandler(context) {
        let cardPlayedEvent = context.game.getEvent('onCardPlayed', {
            player: context.player,
            card: context.source,
            originalLocation: context.source.location
        });
        context.game.openEventWindow([new AttachAction({ upgrade: context.source }).getEvent(context.target, context), cardPlayedEvent]);
    }

    isCardPlayed() {
        return true;
    }
}

module.exports = PlayUpgradeAction;
