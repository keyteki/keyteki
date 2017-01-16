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
        var numOtherKnights = this.controller.cardsInPlay.reduce((counter, card) => {
            if(this.isBlank() || !card.hasTrait('Knight') || card === this) {
                return counter;
            }

            return counter + 1;
        }, 0);

        return numOtherKnights >= 1;
    }
}

HedgeKnight.code = '02057';

module.exports = HedgeKnight;
