const TriggeredAbility = require('../triggeredability.js');

class PrideAbility extends TriggeredAbility {
    constructor(game, card) {
        super(game, card, 'forcedreaction', {
            when: {
                afterConflict: (event, context) => context.source.isParticipating() && context.source.hasPride() &&
                                                   ((event.conflict.winner === context.player && context.source.allowGameAction('honor', context)) ||
                                                   (event.conflict.loser === context.player && context.source.allowGameAction('dishonor', context)))
            },
            title: 'Pride',
            cannotBeCopied: true,
            printedAbility: false,
            handler: context => {
                if(context.event.conflict.winner === context.player) {
                    this.game.addMessage('{0} is honored due to their Pride', context.source);
                    this.game.applyGameAction(context, { honor: context.source });
                } else {
                    this.game.addMessage('{0} is dishonored due to their Pride', context.source);
                    this.game.applyGameAction(context, { dishonor: context.source });
                }
            }
        });
    }
}

module.exports = PrideAbility;
