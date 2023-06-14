const Card = require('../../Card.js');

class Subdue extends Card {
    // Play: Deal 1D to a creature and stun it.
    setupCardAbilities(ability) {
        this.play({
            target: {
                cardType: 'creature',
                gameAction: [ability.actions.dealDamage({ amount: 1 }), ability.actions.stun()]
            }
        });
    }
}

Subdue.id = 'subdue';

module.exports = Subdue;
