const Card = require('../../Card.js');

class JohnSmyth extends Card {
    // Elusive. (The first time this creature is attacked each turn, no damage is dealt.)
    // Fight/Reap: Ready a non-Agent Mars creature.
    setupCardAbilities(ability) {
        this.fight({
            reap: true,
            target: {
                cardType: 'creature',
                cardCondition: (card) => !card.hasTrait('agent') && card.hasHouse('mars'),
                gameAction: ability.actions.ready()
            }
        });
    }
}

JohnSmyth.id = 'john-smyth';

module.exports = JohnSmyth;
