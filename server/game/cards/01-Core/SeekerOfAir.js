const RoleCard = require('../../rolecard.js');

class SeekerOfAir extends RoleCard {
    setupCardAbilities(ability) {
        this.reaction({
            title: 'Gain 1 fate',
            when: {
                onProvinceRevealed: (event, context) => event.province.controller === context.player && context.source.hasTrait(event.province.getElement())
            },
            gameAction: ability.actions.gainFate()
        });
    }
}

SeekerOfAir.id = 'seeker-of-air';

module.exports = SeekerOfAir;
