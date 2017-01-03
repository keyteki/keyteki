const DrawCard = require('../../../drawcard.js');

class SealOfTheHand extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Stand attached character',
            method: 'kneel'
        });
    }

    kneel(player) {
        if(!this.parent || !this.parent.kneeled) {
            return false;
        }

        player.standCard(this.parent);
        player.kneelCard(this);

        this.game.addMessage('{0} kneels {1} to stand {2}', player, this, this.parent);
    }

    canAttach(player, card) {
        if(!card.hasTrait('Lady') && !card.hasTrait('Lord')) {
            return false;
        }

        return super.canAttach(player, card);
    }
}

SealOfTheHand.code = '01032';

module.exports = SealOfTheHand;
