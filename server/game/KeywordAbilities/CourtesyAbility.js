const TriggeredAbility = require('../triggeredability.js');

class CourtesyAbility extends TriggeredAbility {
    constructor(game, card) {
        super(game, card, 'forcedinterrupt', {
            when: {
                onCardLeavesPlay: (event, context) => event.card === context.source && 
                                                      context.source.hasCourtesy()
            },
            title: 'Courtesy',
            cannotBeCopied: true,
            printedAbility: false,
            handler: context => {
                this.game.addMessage('{0} gains a fate due to {1}\'s Courtesy', context.player, context.source);
                this.game.addFate(context.player, 1);
            }
        });
    }
}

module.exports = CourtesyAbility;
