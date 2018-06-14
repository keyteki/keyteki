const DrawCard = require('../../drawcard.js');

class CourtMask extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Return court mask to hand',
            effect: 'return {0} to hand, dishonoring {1}',
            effectArgs: context => context.source.parent,
            gameAction: [
                ability.actions.returnToHand(), 
                ability.actions.dishonor(context => ({ target: context.source.parent }))
            ]
        });
    }
    
    canAttach(card, context) {
        if(card.controller !== context.player) {
            return false;
        }
        return super.canAttach(card, context);
    }
}

CourtMask.id = 'court-mask';

module.exports = CourtMask;

