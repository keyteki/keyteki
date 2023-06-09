const Card = require('../../Card.js');

class Urchin extends Card {
    // Elusive. (The first time this creature is attacked each turn, no damage is dealt.)
    // Play: Steal 1<A>.
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.steal()
        });
    }
}

Urchin.id = 'urchin';

module.exports = Urchin;
