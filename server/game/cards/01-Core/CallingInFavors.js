const DrawCard = require('../../drawcard.js');

class CallingInFavors extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            cost: ability.costs.dishonor(() => true),
            target: {
                cardType: 'attachment',
                cardCondition: card => card.controller !== this.controller && card.location === 'play area'
            },
            handler: context => {
                context.target.controller = this.controller;
                if(this.controller.canAttach(context.target, context.costs.dishonor)) {
                    this.game.addMessage('{0} plays {1}, dishonoring {2} in order to take control of {3} and attach it to {2}', this.controller, this, context.costs.dishonor, context.target);
                    this.controller.attach(context.target, context.costs.dishonor);
                } else {
                    this.game.addMessage('{0} plays {1}, dishonoring {2} but {3} cannot attach to them so it is discarded', this.controller, this, context.costs.dishonor, context.target);
                    context.target.owner.discardCardFromPlay(context.target);
                }
            }
        });
    }
}

CallingInFavors.id = 'calling-in-favors';

module.exports = CallingInFavors;
