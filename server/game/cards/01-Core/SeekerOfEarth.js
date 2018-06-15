const RoleCard = require('../../rolecard.js');

class SeekerOfEarth extends RoleCard {
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

SeekerOfEarth.id = 'seeker-of-earth';

module.exports = SeekerOfEarth;
