const DrawCard = require('../../../drawcard.js');

class PracticeBlade extends DrawCard {
    canAttach(player, card) {
        if(card.getType() !== 'character' || card.getFaction() !== this.getFaction()) {
            return false;
        }

        return super.canAttach(player, card);
    }

    attach(player, card) {
        card.strengthModifier += 1;
        card.addIcon('military');
    }

    leavesPlay() {
        super.leavesPlay();

        this.parent.strengthModifier -= 1;
        this.parent.removeIcon('military');
    }
}

PracticeBlade.code = '02046';

module.exports = PracticeBlade;
