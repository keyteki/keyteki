const Card = require('../../Card.js');

class WitchOfTheSpore extends Card {
    // Scrap: Deal 3 to an enemy creature.
    setupCardAbilities(ability) {
        this.scrap({
            target: {
                controller: 'opponent',
                cardType: 'creature',
                gameAction: ability.actions.dealDamage({ amount: 3 })
            }
        });
    }
}

WitchOfTheSpore.id = 'witch-of-the-spore';

module.exports = WitchOfTheSpore;
