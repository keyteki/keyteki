const DrawCard = require('../../drawcard.js');

class WholenessOfTheWorld extends DrawCard {
    setupCardAbilities() {
        this.interrupt({
            title: 'Keep a claimed ring',
            when: {
                onReturnRing: event => event.ring.isConsideredClaimed(this.controller)
            },
            canCancel: true,
            handler: context => {
                this.game.addMessage('{0} plays {1} to prevent the {2} from returning to the unclaimed pool', context.player, context.source, context.event.ring.element);
                context.cancel();
            }
        });
    }
}

WholenessOfTheWorld.id = 'wholeness-of-the-world';

module.exports = WholenessOfTheWorld;
