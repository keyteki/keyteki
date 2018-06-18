const DrawCard = require('../../drawcard.js');

class WholenessOfTheWorld extends DrawCard {
    setupCardAbilities() {
        this.wouldInterrupt({
            title: 'Keep a claimed ring',
            when: {
                onReturnRing: (event, context) => event.ring.claimedBy === context.player.name
            },
            cannotBeMirrored: true,
            effect: 'prevent {1} from returning to the unclaimed pool',
            effectArgs: context => context.event.ring,
            handler: context => context.cancel()
        });
    }
}

WholenessOfTheWorld.id = 'wholeness-of-the-world';

module.exports = WholenessOfTheWorld;
