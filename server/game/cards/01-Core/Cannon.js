const Card = require('../../Card.js');

class Cannon extends Card {
    // Action: Deal 2<D> to a creature.
    setupCardAbilities(ability) {
        this.action({
            target: {
                cardType: 'creature',
                gameAction: ability.actions.dealDamage({ amount: 2 })
            }
        });
    }
}

Cannon.id = 'cannon';

module.exports = Cannon;
