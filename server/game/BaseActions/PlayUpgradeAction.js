const BasePlayAction = require('./BasePlayAction');
const AttachAction = require('../GameActions/AttachAction');
const LastingEffectCardAction = require('../GameActions/LastingEffectCardAction');
const Effects = require('../effects');

class PlayUpgradeAction extends BasePlayAction {
    constructor(card) {
        super(card, {
            activePromptTitle: 'Choose a creature to attach this upgrade to',
            cardType: 'creature',
            gameAction: new AttachAction((context) => ({ upgrade: context.source }))
        }, 'upgrade');
    }

    displayMessage(context) {
        if(context.target) {
            context.game.addMessage(
                '{0} plays {1} attaching it to {2}',
                context.player,
                context.source,
                context.target
            );
        } else {
            context.game.addMessage(
                '{0} plays {1} and it is discarded',
                context.player,
                context.source
            );
        }
    }

    executeHandler(context) {
        const event = context.game.getEvent('onCardPlayed', {
            player: context.player,
            card: context.source,
            originalLocation: context.source.location
        });
        event.addChildEvent(
            new AttachAction({ upgrade: context.source }).getEvent(context.target, context)
        );
        if(context.source.type === 'creature') {
            const changeTypeEvent = new LastingEffectCardAction({
                duration: 'lastingEffect',
                effect: Effects.changeType('upgrade')
            }).getEvent(context.source, context);
            changeTypeEvent.gameAction = null;
            event.addChildEvent(changeTypeEvent);
        }

        this.addBonusIconResolution(event, context);
        context.game.openEventWindow(event);
    }
}

module.exports = PlayUpgradeAction;
