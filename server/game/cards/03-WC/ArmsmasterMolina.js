const Card = require('../../Card.js');

class ArmsmasterMolina extends Card {
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: (card) => this.neighbors.includes(card),
            effect: ability.effects.addKeyword({ hazardous: 3 })
        });
    }
}

ArmsmasterMolina.id = 'armsmaster-molina';

module.exports = ArmsmasterMolina;
