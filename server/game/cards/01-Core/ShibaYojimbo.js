const _ = require('underscore');
const DrawCard = require('../../drawcard.js');

class ShibaYojimbo extends DrawCard {
    setupCardAbilities() {
        this.interrupt({
            title: 'Cancel ability',
            when: {
                onCardAbilityInitiated: event => _.any(event.cardTargets, card => card.hasTrait('shugenja') && card.controller === this.controller) && 
                                                 event.context.ability.isTriggeredAbility()
            },
            canCancel: true,
            handler: context => {
                this.game.addMessage('{0} uses {1} to cancel the effects of {2}', this.controller, this, context.event.card);
                context.cancel();
            }
        });
    }
}

ShibaYojimbo.id = 'shiba-yojimbo';

module.exports = ShibaYojimbo;
