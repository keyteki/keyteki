const Card = require('../../Card.js');

class GrenadeSnib extends Card {
    // Destroyed: Your opponent loses 2<A>.
    setupCardAbilities(ability) {
        this.destroyed({
            gameAction: ability.actions.loseAmber({ amount: 2 })
        });
    }
}

GrenadeSnib.id = 'grenade-snib';

module.exports = GrenadeSnib;
