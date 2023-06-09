const Card = require('../../Card.js');

class Nexus extends Card {
    // Elusive. (The first time this creature is attacked each turn, no damage is dealt.)
    // Reap: Use an opponents artifact as if it were yours.
    setupCardAbilities(ability) {
        this.reap({
            target: {
                cardType: 'artifact',
                controller: 'opponent',
                gameAction: ability.actions.use()
            }
        });
    }
}

Nexus.id = 'nexus';

module.exports = Nexus;
