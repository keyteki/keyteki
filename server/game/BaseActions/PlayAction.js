const BasePlayAction = require('./BasePlayAction');

class PlayAction extends BasePlayAction {
    constructor(card) {
        super(card);
        this.title = 'Play this action';
    }

    displayMessage(context) {
        // Check if card is restricted from being played
        let location = context.source.mostRecentEffect('actionCardLocationAfterPlay') || 'discard';
        if (location !== 'discard') {
            // Show custom message for attempting to play restricted card
            context.game.addMessage(
                '{0} tries to play {1} but is unable to, returning it to {2}',
                context.player,
                context.source,
                location
            );
        } else {
            // Normal play message
            super.displayMessage(context);
        }
    }

    executeHandler(context) {
        context.player.moveCard(context.source, 'being played');
        super.executeHandler(context);
        context.game.queueSimpleStep(() => {
            if (context.source.location === 'being played') {
                let location =
                    context.source.mostRecentEffect('actionCardLocationAfterPlay') || 'discard';
                context.source.owner.moveCard(context.source, location);
            }
        });
    }
}

module.exports = PlayAction;
