const DrawCard = require('../../../drawcard.js');

class PracticeBlade extends DrawCard {
    setupCardAbilities(dsl) {
        this.whileAttached({
            effect: dsl.effects.modifyStrength(1)
        });
        this.whileAttached({
            effect: dsl.effects.addIcon('military')
        });
    }

    canAttach(player, card) {
        if(card.getType() !== 'character' || card.getFaction() !== this.getFaction()) {
            return false;
        }

        return super.canAttach(player, card);
    }
}

PracticeBlade.code = '02046';

module.exports = PracticeBlade;
