const DrawCard = require('../../../drawcard.js');

class StinkingDrunk extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                onCardStood: (event, player, card) => card === this.parent
            },
            handler: () => {
                this.game.addMessage('{0} sacrifices {1} to kneel {2}', this.controller, this, this.parent);

                this.parent.controller.kneelCard(this.parent);
                this.owner.sacrificeCard(this);
            }
        });
    }

    canAttach(player, card) {
        if(card.getType() !== 'character' || card.controller === this.controller) {
            return false;
        }

        return super.canAttach(player, card);
    }
}

StinkingDrunk.code = '02088';

module.exports = StinkingDrunk;
