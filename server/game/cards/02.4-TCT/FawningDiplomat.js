const DrawCard = require('../../drawcard.js');

class FawningDiplomat extends DrawCard {
    setupCardAbilities() {
        this.interrupt({
            title: 'Claim Imperial favor',
            when: {
                onCardLeavesPlay: event => event.card === this
            },
            handler: () => {
                this.controller.claimImperialFavor();
            }
        });
    }
}

FawningDiplomat.id = 'fawning-diplomat';

module.exports = FawningDiplomat;
