const _ = require('underscore');
const DrawCard = require('../../drawcard.js');
const EventRegistrar = require('../../eventregistrar.js');

class StaunchHida extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            limit: ability.limit.perConflictPhase(1),
            when: {
                afterConflict: event => event.conflict.winner === this.controller
            },
            handler: () => {
                this.game.addMessage('{0} uses {1} to resolve the ring effect', this.controller, this);
                context.event.conflict.resolveConflictRing(this.controller);
            }
        });
    }
}

StaunchHida.id = 'staunch-hida';

module.exports = StaunchHida;
