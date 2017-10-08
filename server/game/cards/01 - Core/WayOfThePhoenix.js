const DrawCard = require('../../drawcard.js');

class WayOfThePhoenix extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Prevent an opponent contesting a ring',
            clickToActivate: true,
            target: {
                mode: 'ring',
                ringCondition: () => true
            },
            handler: context => {
                let otherPlayer = this.game.getOtherPlayer(context.player);
                this.game.addMessage('{0} uses {1} to prevent {2} from initiating a conflict with the {3} ring', context.player, this, otherPlayer, context.target.element);
            }
        });
    }
}

WayOfThePhoenix.id = 'way-of-the-phoenix';

module.exports = WayOfThePhoenix;
