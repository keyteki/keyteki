const DrawCard = require('../../../drawcard.js');

class HedgeKnight extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => this.isControlAnotherKnight(),
            match: this,
            effect: [
                ability.effects.modifyStrength(1),
                ability.effects.addIcon('power')
            ]
        });
    }

    isControlAnotherKnight() {
        return this.controller.anyCardsInPlay(card => card.hasTrait('Knight') && card !== this);
    }
}

HedgeKnight.code = '02057';

module.exports = HedgeKnight;
