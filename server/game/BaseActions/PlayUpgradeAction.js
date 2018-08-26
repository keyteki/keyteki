const BasePlayAction = require('./BasePlayAction');
const AttachAction = require('../GameActions/AttachAction');

class PlayUpgradeAction extends BasePlayAction {
    constructor(card) {
        super(card, {
            activePromptTitle: 'Choose a creature to attach this upgrade to',
            cardType: 'creature',
            gameAction: new AttachAction(context => ({ upgrade: context.source }))
        });
        this.title = 'Play this upgrade';
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
}

module.exports = PlayUpgradeAction;
