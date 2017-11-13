const DrawCard = require('../../drawcard.js');

class HonoredBlade extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                afterConflict: event => event.conflict.isParticipating(this.parent) && event.conflict.winner === this.parent.controller
            },
            handler: () => {
                this.game.addMessage('{0} uses {1} to gain 1 honor', this.controller, this);
                this.game.addHonor(this.controller, 1);
            }
        });
    }
}

HonoredBlade.id = 'honored-blade';

module.exports = HonoredBlade;
