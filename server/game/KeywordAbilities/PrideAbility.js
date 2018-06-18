const TriggeredAbility = require('../triggeredability.js');
const AbilityLimit = require('../abilitylimit');

class PrideAbility extends TriggeredAbility {
    constructor(game, card) {
        super(game, card, 'forcedreaction', {
            when: {
                afterConflict: (event, context) => context.source.isParticipating() && context.source.hasPride() &&
                                                   ((event.conflict.winner === context.player && context.source.allowGameAction('honor', context)) ||
                                                   (event.conflict.loser === context.player && context.source.allowGameAction('dishonor', context)))
            },
            title: card.name + '\'s Pride',
            printedAbility: false,
            message: '{0} is {1}honored due to their Pride',
            messageArgs: context => [context.source, context.event.conflict.winner === context.player ? '' : 'dis'],
            limit: AbilityLimit.perConflict(1),
            handler: context => {
                if(context.event.conflict.winner === context.player) {
                    this.game.applyGameAction(context, { honor: context.source });
                } else {
                    this.game.applyGameAction(context, { dishonor: context.source });
                }
            }
        });
    }

    isTriggeredAbility() {
        return false;
    }
}

module.exports = PrideAbility;
