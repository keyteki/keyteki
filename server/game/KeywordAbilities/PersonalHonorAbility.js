const TriggeredAbility = require('../triggeredability.js');

class PersonalHonorAbility extends TriggeredAbility {
    constructor(game, card) {
        super(game, card, 'forcedinterrupt', {
            when: {
                onCardLeavesPlay: (event, context) => event.card === context.source && 
                                                      context.source.allowGameAction('affectedByHonor') && 
                                                      (context.source.isHonored || context.source.isDishonored)
            },
            title: 'Personal Honor',
            cannotBeCopied: true,
            printedAbility: false,
            handler: context => {
                if(context.source.isHonored) {
                    this.game.addMessage('{0} gains 1 honor due to {1}\'s personal honor', context.player, context.source);
                    this.game.addHonor(context.player, 1);
                } else if(context.source.isDishonored) {
                    this.game.addMessage('{0} loses 1 honor due to {1}\'s personal honor', context.player, context.source);
                    this.game.addHonor(context.player, -1);
                }
            }
        });
    }
}

module.exports = PersonalHonorAbility;
