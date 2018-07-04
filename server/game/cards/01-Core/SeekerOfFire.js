const RoleCard = require('../../rolecard.js');

class SeekerOfFire extends RoleCard {
    setupCardAbilities(ability) {
        this.reaction({
            title: 'Gain 1 fate',
            when: {
                onProvinceRevealed: (event, context) => event.card.controller === context.player && context.source.hasTrait(event.card.getElement())
            },
            gameAction: ability.actions.gainFate()
        });
    }
}

SeekerOfFire.id = 'seeker-of-fire';

module.exports = SeekerOfFire;
