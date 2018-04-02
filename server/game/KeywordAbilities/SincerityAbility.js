const TriggeredAbility = require('../triggeredability.js');

class SincerityAbility extends TriggeredAbility {
    constructor(game, card) {
        super(game, card, 'forcedinterrupt', {
            when: {
                onCardLeavesPlay: (event, context) => event.card === context.source && 
                                                      context.source.hasSincerity()
            },
            title: 'Sincerity',
            cannotBeCopied: true,
            printedAbility: false,
            handler: context => {
                this.game.addMessage('{0} draws a card due to {1}\'s Sincerity', context.player, context.source);
                context.player.drawCardsToHand(1);
            }
        });
    }
}

module.exports = SincerityAbility;
