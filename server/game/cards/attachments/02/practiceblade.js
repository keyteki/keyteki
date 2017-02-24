const DrawCard = require('../../../drawcard.js');

class PracticeBlade extends DrawCard {
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: [
                ability.effects.modifyStrength(1),
                ability.effects.addIcon('military')
            ]
        });
    }

    canAttach(player, card) {
        if(card.getType() !== 'character' || !card.isFaction('thenightswatch')) {
            return false;
        }

        return super.canAttach(player, card);
    }
}

PracticeBlade.code = '02046';

module.exports = PracticeBlade;
