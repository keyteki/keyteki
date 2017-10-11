const DrawCard = require('../../drawcard.js');

class ForgedEdict extends DrawCard {
    setupCardAbilities(ability) {
        this.interrupt({
            when: {
                onCardAbilityInitiated: event => event.source.type === 'event'
            },
            canCancel: true,
            cost: ability.costs.dishonorCharacter(card => card.hasTrait('courtier')),
            handler: context => {
                this.game.addMessage('{0} dishonors {1} to cancel {2} using {3}', this.controller, context.costs.dishonorCharacter, context.event.source, this);
                context.cancel();
            }
        });
    }
}

ForgedEdict.id = 'forged-edict';

module.exports = ForgedEdict;
