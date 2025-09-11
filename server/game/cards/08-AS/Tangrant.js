const Card = require('../../Card.js');

class Tangrant extends Card {
    // You may play a Mars card during each turn in which Mars is not your active house.
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: (context) => context.player.activeHouse !== 'mars',
            effect: ability.effects.canPlayHouse('mars')
        });
    }
}

Tangrant.id = 'tangrant';

module.exports = Tangrant;
