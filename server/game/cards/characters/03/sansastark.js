const DrawCard = require('../../../drawcard.js');

class SansaStark extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: card => card === this,
            effect: ability.effects.dynamicStrength(() => this.calculateStrength())
        });
        this.persistentEffect({
            condition: () => this.getStrength() === 0,
            match: card => card === this,
            effect: ability.effects.addKeyword('Insight')
        });
    }

    calculateStrength() {
        return this.controller.deadPile.reduce((count, card) => {
            if(card.isFaction('stark')) {
                return count - 1;
            }

            return count;
        }, 0);
    }
}

SansaStark.code = '03013';

module.exports = SansaStark;
