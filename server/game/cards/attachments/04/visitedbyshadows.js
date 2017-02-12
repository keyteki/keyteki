const DrawCard = require('../../../drawcard.js');

class VisitedByShadows extends DrawCard {
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: ability.effects.modifyStrength(-1)
        });
    }

    canAttach(player, card) {
        if(card.getType() !== 'character' || card.controller === this.controller) {
            return false;
        }
        return super.canAttach(player, card);
    }
}

VisitedByShadows.code = '04048';

module.exports = VisitedByShadows;
