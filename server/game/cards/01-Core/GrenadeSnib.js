const Card = require('../../Card.js');

class GrenadeSnib extends Card {
    setupCardAbilities(ability) {
        this.destroyed({
            gameAction: ability.actions.loseAmber({ amount: 2 })
        });
    }
}

GrenadeSnib.id = 'grenade-snib'; // This is a guess at what the id might be - please check it!!!

module.exports = GrenadeSnib;
