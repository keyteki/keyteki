const Card = require('../../Card.js');

class Mogghunter extends Card {
    // Fight: Deal 2D to a flank creature.
    setupCardAbilities(ability) {
        this.fight({
            target: {
                cardType: 'creature',
                cardCondition: (card) => card.isOnFlank(),
                gameAction: ability.actions.dealDamage({ amount: 2 })
            }
        });
    }
}

Mogghunter.id = 'mogghunter';

module.exports = Mogghunter;
