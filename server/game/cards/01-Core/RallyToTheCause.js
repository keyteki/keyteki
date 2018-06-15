const ProvinceCard = require('../../provincecard.js');

class RallyToTheCause extends ProvinceCard {
    setupCardAbilities() {
        this.reaction({
            title: 'Switch the conflict type',
            when: {
                onProvinceRevealed: (event, context) => event.province === context.source
            },
            effect: 'switch the conflict type',
            handler: context => context.event.conflict.switchType()
        });
    }
}

RallyToTheCause.id = 'rally-to-the-cause';

module.exports = RallyToTheCause;
