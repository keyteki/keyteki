const BasePlayAction = require('./BasePlayAction');

class PlayAction extends BasePlayAction {
    constructor(card) {
        super(card);
        this.title = 'Play this action';
    }

    executeHandler(context) {
        let location = context.source.location;
        context.player.moveCard(context.source, 'being played');
        let event = context.game.raiseEvent('onCardPlayed', {
            player: context.player,
            card: context.source,
            originalLocation: location
        });
        this.addBonusIconResolution(event, context);
        context.game.queueSimpleStep(() => {
            if (context.source.hasKeyword('omega')) {
                // it could be a lasting effect, so store it for later check
                context.game.omegaCard = context.source;
            }
            if (context.source.location === 'being played') {
                context.source.owner.moveCard(context.source, 'discard');
            }
        });
    }
}

module.exports = PlayAction;
