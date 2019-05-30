const BasePlayAction = require('./BasePlayAction');

class PlayAction extends BasePlayAction {
    constructor(card) {
        super(card);
        this.title = 'Play this action';
    }

    executeHandler(context) {
        let location = context.source.location;
        context.player.moveCard(context.source, 'being played');
        context.game.raiseEvent('onCardPlayed', {
            player: context.player,
            card: context.source,
            originalLocation: location
        });
        context.game.queueSimpleStep(() => {
            if(context.source.location === 'being played') {
                context.source.owner.moveCard(context.source, 'discard');
            }
        });
    }
}

module.exports = PlayAction;
