const ProvinceCard = require('../../provincecard.js');

class DefendTheWall extends ProvinceCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                afterConflict: event => event.conflict.conflictProvince === this && event.conflict.winner === this.controller
            },
            handler: () => {
                this.game.addMessage('{0} uses {1} to resolve the ring effect', this.controller, this);
                this.controller.resolveRingEffects(this.game.currentConflict.conflictRing);
            }
        });
    }
}

DefendTheWall.id = 'defend-the-wall';

module.exports = DefendTheWall;
