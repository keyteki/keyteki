const _ = require('underscore');
const RoleCard = require('../../rolecard.js');

class KeeperOfEarth extends RoleCard {
    setupCardAbilities() {
        this.reaction({
            title: 'Gain 1 fate',
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

KeeperOfEarth.id = 'keeper-of-earth';

module.exports = KeeperOfEarth;
