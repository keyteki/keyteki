const Card = require('../../Card.js');

class OldBruno extends Card {
    // Elusive. (The first time this creature is attacked each turn, no damage is dealt.)
    // Play: Capture 3<A>.
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.capture({ amount: 3 })
        });
    }
}

OldBruno.id = 'old-bruno';

module.exports = OldBruno;
