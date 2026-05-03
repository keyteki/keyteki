const Card = require('../../Card.js');

class JeenPeary extends Card {
    // After Reap: If Jeen Peary is on a flank, steal 1A.
    setupCardAbilities(ability) {
        this.reap({
            condition: (context) => context.source.isOnFlank(),
            gameAction: ability.actions.steal({ amount: 1 })
        });
    }
}

JeenPeary.id = 'jeen-peary';

module.exports = JeenPeary;
