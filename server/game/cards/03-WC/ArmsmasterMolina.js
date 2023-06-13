const Card = require('../../Card.js');

class ArmsmasterMolina extends Card {
    // Hazardous 3. (Before this creature is attacked, deal 3D to the attacking enemy.)
    // Each of Armsmaster Molinas neighbors gains hazardous 3.
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: (card, context) => context.source.neighbors.includes(card),
            effect: ability.effects.addKeyword({ hazardous: 3 })
        });
    }
}

ArmsmasterMolina.id = 'armsmaster-molina';

module.exports = ArmsmasterMolina;
