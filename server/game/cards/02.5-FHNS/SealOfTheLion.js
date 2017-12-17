const DrawCard = require('../../drawcard.js');

class SealOfTheLion extends DrawCard {
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: [
                ability.effects.addFaction('lion'),
                ability.effects.addTrait('commander')
            ]
        });
    }
}

SealOfTheLion.id = 'seal-of-the-lion';

module.exports = SealOfTheLion;
