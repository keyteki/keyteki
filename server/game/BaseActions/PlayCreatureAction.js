const BasePlayAction = require('./BasePlayAction');

class PlayCreatureAction extends BasePlayAction {
    constructor(card) {
        super(card);
        this.title = 'Play this creature';
    }

    executeHandler(context) {
        let cardPlayedEvent = context.game.getEvent('onCardPlayed', {
            player: context.player,
            card: context.source,
            originalLocation: context.source.location
        });
        let action = context.game.actions.putIntoPlay({ myControl: true });
        action.preEventHandler(context);
        this.addBonusIconResolution(cardPlayedEvent, context);
        cardPlayedEvent.addChildEvent(action.getEvent(context.source, context));
        context.game.openEventWindow(cardPlayedEvent);
    }
}

module.exports = PlayCreatureAction;
