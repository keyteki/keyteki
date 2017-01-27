const DrawCard = require('../../../drawcard.js');

class WardensOfTheReach extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: card => card === this,
            effect: ability.effects.dynamicStrength(() => this.calculateStrength())
        });
    }

    calculateStrength() {
        return this.controller.cardsInPlay.reduce((counter, card) => {
            if(card.getType() !== 'location' || !card.hasTrait('The Reach')) {
                return counter;
            }

            return counter + 1;
        }, 0);
    }
}

WardensOfTheReach.code = '01190';

module.exports = WardensOfTheReach;
