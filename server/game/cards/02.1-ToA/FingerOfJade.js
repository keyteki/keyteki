const _ = require('underscore');
const DrawCard = require('../../drawcard.js');

class FingerOfJade extends DrawCard {
    setupCardAbilities(ability) {
        this.interrupt({
            title: 'Cancel an ability',
            when: {
                onCardAbilityInitiated: event => _.any(event.cardTargets, card => card === this.parent)
            },
            canCancel: true,
            cost: ability.costs.sacrificeSelf(),
            handler: context => {
                this.game.addMessage('{0} sacrifices {1} to cancel the effects of {2}', this.controller, this, context.event.card);
                context.cancel();
            }
        });
    }

    canAttach(card) {
        if(card.controller !== this.controller) {
            return false;
        }
        return super.canAttach(card);
    }
}

FingerOfJade.id = 'finger-of-jade';

module.exports = FingerOfJade;
