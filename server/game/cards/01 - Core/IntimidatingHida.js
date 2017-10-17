const DrawCard = require('../../drawcard.js');

class IntimidatingHida extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                onConflictPass: event => event.conflict.attackingPlayer !== this.controller
            },
            handler: () => {
                let otherPlayer = this.game.getOtherPlayer(this.controller);
                this.game.addMessage('{0} uses {1} to take 1 honor from {2}', this.controller, this, otherPlayer);
                this.game.addHonor(otherPlayer, -1);
            }
        });
    }
}

IntimidatingHida.id = 'intimidating-hida';

module.exports = IntimidatingHida;
