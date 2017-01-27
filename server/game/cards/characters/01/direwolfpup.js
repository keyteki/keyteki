const DrawCard = require('../../../drawcard.js');

class DirewolfPup extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: card => card === this,
            effect: ability.effects.dynamicStrength(() => this.calculateStrength())
        });
    }

    calculateStrength() {
        return this.controller.cardsInPlay.reduce((counter, card) => {
            if(card.uuid === this.uuid || !card.hasTrait('Direwolf')) {
                return counter;
            }

            return counter + 1;
        }, 0);
    }
}

DirewolfPup.code = '01149';

module.exports = DirewolfPup;
