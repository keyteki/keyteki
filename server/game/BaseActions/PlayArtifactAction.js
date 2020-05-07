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
        context.game.openEventWindow([context.game.actions.putIntoPlay({ myControl: true }).getEvent(context.source, context), cardPlayedEvent]);
    }
}

module.exports = PlayAction;

