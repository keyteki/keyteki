const DrawCard = require('../../../drawcard.js');

class SansaStark extends DrawCard {
    setupCardAbilities(dsl) {
        this.persistentEffect({
            match: card => card === this,
            effect: dsl.effects.dynamicStrength(() => this.calculateStrength())
        });
        this.persistentEffect({
            condition: () => this.getStrength() === 0,
            match: card => card === this,
            effect: dsl.effects.addKeyword('Insight')
        });
    }

    calculateStrength() {
        return this.controller.deadPile.reduce((count, card) => {
            if(card.getFaction() === 'stark') {
                return count - 1;
            }

            return count;
        }, 0);
    }
}

SansaStark.code = '03013';

module.exports = SansaStark;
