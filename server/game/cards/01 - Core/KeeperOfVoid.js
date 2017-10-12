const _ = require('underscore');
const RoleCard = require('../../rolecard.js');

class KeeperOfVoid extends RoleCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                afterConflict: event => {
                    console.log('checking conditions of', this.name);
                    console.log(this.hasTrait('void'), event.conflict.elements, event.conflict.winner === this.controller, event.conflict.defendingPlayer === this.controller);
                    return _.any(event.conflict.elements, element => this.hasTrait(element)) && event.conflict.winner === this.controller && event.conflict.defendingPlayer === this.controller;
                }
            },
            handler: () => {
                this.game.addMessage('{0} uses {1} to gain 1 fate', this.controller, this);
                this.game.addFate(this.controller, 1);
            }
        });
    }
}

KeeperOfVoid.id = 'keeper-of-void';

module.exports = KeeperOfVoid;
