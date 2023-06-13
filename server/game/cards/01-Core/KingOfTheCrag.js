const Card = require('../../Card.js');

class KingOfTheCrag extends Card {
    // Each enemy Brobnar creature gets 2power.
    setupCardAbilities(ability) {
        this.persistentEffect({
            targetController: 'opponent',
            match: (card) => card.hasHouse('brobnar'),
            effect: ability.effects.modifyPower(-2)
        });
    }
}

KingOfTheCrag.id = 'king-of-the-crag';

module.exports = KingOfTheCrag;
