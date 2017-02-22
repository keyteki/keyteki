const DrawCard = require('../../../drawcard.js');

class Ward extends DrawCard {
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: [
                ability.effects.addFaction('stark'),
                ability.effects.takeControl(this.controller)
            ]
        });
    }

    canAttach(player, card) {
        if(card.getType() !== 'character' || card.getCost() > 4) {
            return false;
        }

        return super.canAttach(player, card);
    }
}

Ward.code = '02102';

module.exports = Ward;
