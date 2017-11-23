const ProvinceCard = require('../../provincecard.js');

class RallyToTheCause extends ProvinceCard {
    setupCardAbilities() {
        this.reaction({
            title: 'Switch the conflict type',
            when: {
                onProvinceRevealed: event => event.province === this
            },
            handler: context => {
                context.event.conflict.switchType();
                this.game.addMessage('{0} uses {1} to change the conflict to {2}', this.controller, this, context.event.conflict.conflictType);
            }
        });
    }
}

RallyToTheCause.id = 'rally-to-the-cause';

module.exports = RallyToTheCause;
