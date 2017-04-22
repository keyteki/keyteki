const DrawCard = require('../../../drawcard.js');

class WardensOfTheReach extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: card => card === this,
            effect: ability.effects.dynamicStrength(() => this.calculateStrength())
        });
    }

    calculateStrength() {
        return this.controller.getNumberOfCardsInPlay(card => card.getType() === 'location' && card.hasTrait('The Reach'));
    }
}

WardensOfTheReach.code = '01190';

module.exports = WardensOfTheReach;
