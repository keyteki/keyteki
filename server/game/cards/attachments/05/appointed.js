const DrawCard = require('../../../drawcard.js');

class Appointed extends DrawCard {
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: [
                ability.effects.addIcon('intrigue'),
                ability.effects.addTrait('Small Council')
            ]
        });
    }

    canAttach(player, card) {
        if(card.getType() !== 'character' || !card.isUnique()) {
            return false;
        }

        return super.canAttach(player, card);
    }
}

Appointed.code = '05043';

module.exports = Appointed;
