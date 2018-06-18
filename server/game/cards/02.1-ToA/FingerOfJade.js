const DrawCard = require('../../drawcard.js');

class FingerOfJade extends DrawCard {
    setupCardAbilities(ability) {
        this.wouldInterrupt({
            title: 'Cancel an ability',
            when: {
                onCardAbilityInitiated: (event, context) => event.cardTargets.some(card => card === context.source.parent)
            },
            cost: ability.costs.sacrificeSelf(),
            effect: 'cancel the effects of {1}',
            effectArgs: context => context.event.card,
            handler: context => context.cancel()
        });
    }

    canAttach(card, context) {
        if(card.controller !== context.player) {
            return false;
        }
        return super.canAttach(card, context);
    }
}

FingerOfJade.id = 'finger-of-jade';

module.exports = FingerOfJade;
