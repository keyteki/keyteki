const RoleCard = require('../../rolecard.js');

class SeekerOfWater extends RoleCard {
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

SeekerOfWater.id = 'seeker-of-water';

module.exports = SeekerOfWater;
