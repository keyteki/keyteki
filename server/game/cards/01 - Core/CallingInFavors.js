const DrawCard = require('../../drawcard.js');

class CallingInFavors extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            clickToActivate: true,
            cost: ability.costs.dishonorCharacter(() => true),
            target: {
                cardType: 'attachment',
                cardCondition: card => card.controller !== this.controller
            },
            handler: context => {
                if(this.controller.canAttach(context.target, context.costs.dishonorCharacter)) {
                    this.controller.attach(context.target, context.costs.dishonorCharacter);
                } else {
                    context.target.owner.discardCardFromPlay(context.target);
                }
            }
        });
    }
}

CallingInFavors.id = 'calling-in-favors';

module.exports = CallingInFavors;
