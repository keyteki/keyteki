const ProvinceCard = require('../../provincecard.js');

class DefendTheWall extends ProvinceCard {
    setupCardAbilities() {
        this.reaction({
            title: 'Resolve the ring effect',
            when: {
                afterConflict: event => event.conflict.conflictProvince === this && event.conflict.winner === this.controller
            },
            handler: context => {
                this.game.addMessage('{0} uses {1} to resolve the ring effect', this.controller, this);
                context.event.conflict.chooseWhetherToResolveRingEffect(this.controller);
            }
        });
    }
}

DefendTheWall.id = 'defend-the-wall';

module.exports = DefendTheWall;
