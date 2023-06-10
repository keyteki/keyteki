const Card = require('../../Card.js');

class NoddyTheThief extends Card {
    // Elusive. (The first time this creature is attacked each turn, no damage is dealt.)
    // Action: Steal 1<A>.
    setupCardAbilities(ability) {
        this.action({
            gameAction: ability.actions.steal()
        });
    }
}

NoddyTheThief.id = 'noddy-the-thief';

module.exports = NoddyTheThief;
