const BasePlayAction = require('./BasePlayAction');

class PlayAction extends BasePlayAction {
    constructor(card) {
        super(card);
        this.title = 'Play this artifact';
    }

    executeHandler(context) {
        let cardPlayedEvent = context.game.getEvent('onCardPlayed', {
            player: context.player,
            card: context.source,
            originalLocation: context.source.location
        });
        this.addBonusIconResolution(cardPlayedEvent, context);
        cardPlayedEvent.addChildEvent(
            context.game.actions.putIntoPlay({ myControl: true }).getEvent(context.source, context)
        );
        context.game.openEventWindow(cardPlayedEvent);
    }
}

module.exports = PlayAction;
