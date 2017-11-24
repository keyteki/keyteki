const DrawCard = require('../../drawcard.js');

class SealOfTheCrab extends DrawCard {
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: [
                ability.effects.addFaction('crab'),
                ability.effects.addTrait('berserker')
            ]
        });
    }
}

SealOfTheCrab.id = 'seal-of-the-crab';

module.exports = SealOfTheCrab;
