const DrawCard = require('../../../drawcard.js');

class FrozenSolid extends DrawCard {
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: ability.effects.blank
        });
    }

    canAttach(player, card) {
        if(card.getType() !== 'location' || card.isLimited() || card.getCost() > 3) {
            return false;
        }

        return super.canAttach(player, card);
    }
}

FrozenSolid.code = '03021';

module.exports = FrozenSolid;
