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
        return this.controller.getNumberOfCardsInPlay(c => c.hasTrait('R\'hllor') && c.getType() === 'character');
    }
}

RedGodsBlessing.code = '04068';

module.exports = RedGodsBlessing;
