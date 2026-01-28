const BasePlayAction = require('./BasePlayAction');

class PlayAction extends BasePlayAction {
    constructor(card) {
        super(card);
        this.title = 'Play this action';
    }

    displayMessage(context) {
        super.displayMessage(context);

        // Check if card is restricted from being played
        const location =
            context.source.mostRecentEffect('actionCardLocationAfterPlay') || 'discard';
        if (location !== 'discard') {
            context.game.addMessage(
                '{0} is unable to play {1} and returns it to {2}',
                context.player,
                context.source,
                location
            );
        }
    }

    executeHandler(context) {
        context.player.moveCard(context.source, 'being played');
        super.executeHandler(context);
        context.game.queueSimpleStep(() => {
            if (context.source.location === 'being played') {
                const location =
                    context.source.mostRecentEffect('actionCardLocationAfterPlay') || 'discard';
                context.source.owner.moveCard(context.source, location);
            }
        });
    }
}

module.exports = PlayAction;
