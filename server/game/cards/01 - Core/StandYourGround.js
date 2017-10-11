const DrawCard = require('../../drawcard.js');

class StandYourGround extends DrawCard {
    setupCardAbilities() {
        this.interrupt({
            when: {
                onCardLeavesPlay: event => event.card.controller === this.controller && event.card.getType() === 'character' && event.card.isHonored
            },
            canCancel: true,
            handler: context => {
                context.cancel();
                context.event.card.isHonored = false;
                this.game.addMessage('{0} uses {1} to stop {2} from leaving play', this.controller, this, context.event.card);
            }
        });
    }
}

StandYourGround.id = 'stand-your-ground';

module.exports = StandYourGround;
