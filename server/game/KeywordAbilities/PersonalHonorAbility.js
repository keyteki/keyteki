const TriggeredAbility = require('../triggeredability.js');

class PersonalHonorAbility extends TriggeredAbility {
    constructor(game, card) {
        super(game, card, 'forcedinterrupt', {
            when: {
                onCardLeavesPlay: (event, context) => event.card === context.source &&
                                                      context.source.allowGameAction('affectedByHonor') &&
                                                      (context.source.isHonored || context.source.isDishonored)
            },
            title: card.name + '\'s Personal Honor',
            printedAbility: false,
            message: '{0} {1} 1 honor due to {2}\'s personal honor',
            messageArgs: context => [context.player, context.source.isHonored ? 'gains' : 'loses', context.source],
            handler: context => {
                if(context.source.isHonored) {
                    this.game.applyGameAction(context, { gainHonor: context.player });
                } else if(context.source.isDishonored) {
                    this.game.applyGameAction(context, { loseHonor: context.player });
                }
            }
        });
    }

    isTriggeredAbility() {
        return false;
    }
}

module.exports = PersonalHonorAbility;
