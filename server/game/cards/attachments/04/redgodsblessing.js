const DrawCard = require('../../../drawcard.js');

class RedGodsBlessing extends DrawCard {
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: [
                ability.effects.addTrait('R\'hllor'),
                ability.effects.dynamicStrength(() => this.getNumberOfCardsWithRhllor())
            ]
        });
    }

    getNumberOfCardsWithRhllor() {
        var cardsWithRhllor = this.controller.cardsInPlay.reduce((runningTotal, c) => {
            if(c.hasTrait('R\'hllor') && c.getType() === 'character') {
                return runningTotal + 1;
            }

            return runningTotal;
        }, 0);

        return cardsWithRhllor;
    }
}

RedGodsBlessing.code = '04068';

module.exports = RedGodsBlessing;
