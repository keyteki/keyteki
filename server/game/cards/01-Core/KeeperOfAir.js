const _ = require('underscore');
const RoleCard = require('../../rolecard.js');

class KeeperOfAir extends RoleCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                afterConflict: event => _.any(event.conflict.elements, element => this.hasTrait(element)) && event.conflict.winner === this.controller && event.conflict.defendingPlayer === this.controller
            },
            handler: () => {
                this.game.addMessage('{0} uses {1} to gain 1 fate', this.controller, this);
                this.game.addFate(this.controller, 1);
            }
        });
    }
}

KeeperOfAir.id = 'keeper-of-air';

module.exports = KeeperOfAir;
