const DrawCard = require('../../drawcard.js');

class FawningDiplomat extends DrawCard {
    setupCardAbilities() {
        this.interrupt({
            title: 'Claim Imperial favor',
            when: {
                onCardLeavesPlay: (event, context) => event.card === context.source
            },
            effect: 'claim the Emperor\'s favor as she leaves play',
            handler: context => context.player.claimImperialFavor()
        });
    }
}

FawningDiplomat.id = 'fawning-diplomat';

module.exports = FawningDiplomat;
