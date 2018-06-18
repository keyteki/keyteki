const DrawCard = require('../../drawcard.js');

class CallingInFavors extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Take control of an attachment',
            cost: ability.costs.dishonor(() => true),
            target: {
                cardType: 'attachment',
                controller: 'opponent'
            },
            effect: 'take control of {0}',
            handler: context => {
                if(ability.actions.attach({ attachment: context.target }).canAffect(context.costs.dishonor, context)) {
                    this.game.addMessage('{0} attaches {1} to {2}', context.player, context.target, context.costs.dishonor);
                    ability.actions.attach({ attachment: context.target }).resolve(context.costs.dishonor, context);
                } else {
                    // TODO: This message won't work with Mirror
                    this.game.addMessage('{0} cannot be attached to {1}, and so is discarded', context.target, context.costs.dishonor);
                    ability.actions.discardFromPlay().resolve(context.target, context);
                }
            }
        });
    }
}

CallingInFavors.id = 'calling-in-favors';

module.exports = CallingInFavors;
