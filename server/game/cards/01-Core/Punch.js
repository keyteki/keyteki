const Card = require('../../Card.js');

class Punch extends Card {
    // Play: Deal 3<D> to a creature.
    setupCardAbilities(ability) {
        this.play({
            target: {
                cardType: 'creature',
                gameAction: ability.actions.dealDamage({ amount: 3 })
            }
        });
    }
}

Punch.id = 'punch';

module.exports = Punch;
