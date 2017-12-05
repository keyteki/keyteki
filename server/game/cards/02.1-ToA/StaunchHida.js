const DrawCard = require('../../drawcard.js');

class StaunchHida extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            title: 'Resolve the ring effect',
            when: {
                afterConflict: event => event.conflict.winner === this.controller && event.conflict.isDefending(this)
            },
            handler: context => {
                this.game.addMessage('{0} uses {1} to resolve the ring effect', this.controller, this);
                context.event.conflict.chooseWhetherToResolveRingEffect(this.controller);
            }
        });
    }
}

StaunchHida.id = 'staunch-hida';

module.exports = StaunchHida;
