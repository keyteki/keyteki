const DrawCard = require('../../drawcard.js');

class FawningDiplomat extends DrawCard {
    setupCardAbilities() {
        this.interrupt({
            title: 'Claim Imperial favor',
            when: {
                onCardLeavesPlay: event => event.card === this
            },
            handler: () => {
                this.game.addMessage('{0} uses {1} to claim the Emperor\'s favor as she leaves play', this.controller, this);
                this.controller.claimImperialFavor();
            }
        });
    }
}

FawningDiplomat.id = 'fawning-diplomat';

module.exports = FawningDiplomat;
