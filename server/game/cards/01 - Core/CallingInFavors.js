const DrawCard = require('../../drawcard.js');

class CallingInFavors extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            cost: ability.costs.dishonorCharacter(() => true),
            target: {
                cardType: 'attachment',
                cardCondition: card => card.controller !== this.controller
            },
            handler: context => {
                context.target.controller = this.controller;
                if(this.controller.canAttach(context.target, context.costs.dishonorCharacter)) {
                    this.game.addMessage('{0} plays {1}, dishonoring {2} in order to take control of {3} and attach it to {2}', this.controller, this, context.costs.dishonorCharacter, context.target);
                    this.controller.attach(context.target, context.costs.dishonorCharacter);
                } else {
                    this.game.addMessage('{0} plays {1}, dishonoring {2} but {3} cannot attach to them so it is discarded', this.controller, this, context.costs.dishonorCharacter, context.target);
                    context.target.owner.discardCardFromPlay(context.target);
                }
            }
        });
    }
}

CallingInFavors.id = 'calling-in-favors';

module.exports = CallingInFavors;
