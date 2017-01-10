const DrawCard = require('../../../drawcard.js');

class FrozenSolid extends DrawCard {
    canAttach(player, card) {
        if(card.getType() !== 'location' || card.isLimited() || card.getCost() > 3) {
            return false;
        }

        return super.canAttach(player, card);
    }

    attach(player, card) {
        card.setBlank();
    }

    leavesPlay() {
        super.leavesPlay();
        
        this.parent.clearBlank();
    }
}

FrozenSolid.code = '03021';

module.exports = FrozenSolid;
