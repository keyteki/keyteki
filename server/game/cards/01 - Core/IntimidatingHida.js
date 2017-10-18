const DrawCard = require('../../drawcard.js');

class IntimidatingHida extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            title: 'Make opponent lose honor',
            when: {
                onConflictPass: event => event.conflict.attackingPlayer !== this.controller
            },
            handler: () => {
                let otherPlayer = this.game.getOtherPlayer(this.controller);
                this.game.addMessage('{0} uses {1} to make {2} lose an honor', this.controller, this, otherPlayer);
                this.game.addHonor(otherPlayer, -1);
            }
        });
    }
}

IntimidatingHida.id = 'intimidating-hida';

module.exports = IntimidatingHida;
