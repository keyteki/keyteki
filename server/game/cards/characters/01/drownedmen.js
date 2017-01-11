const DrawCard = require('../../../drawcard.js');

class DrownedMen extends DrawCard {
    setupCardAbilities(dsl) {
        this.persistentEffect({
            match: card => card === this,
            effect: dsl.effects.dynamicStrength(() => this.calculateStrength())
        });
    }

    calculateStrength() {
        var cards = this.controller.cardsInPlay.filter(card => {
            return card.getType() === 'location' && card.hasTrait('Warship');
        });

        return cards.length;
    }
}

DrownedMen.code = '01073';

module.exports = DrownedMen;
