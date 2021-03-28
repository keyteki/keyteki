const Card = require('../../Card.js');

class Drummernaut extends Card {
    setupCardAbilities(ability) {
        this.play({
            fight: true,
            reap: true,
            target: {
                cardType: 'creature',
                controller: 'self',
                cardCondition: (card) => card !== this && card.hasTrait('giant'),
                gameAction: ability.actions.returnToHand()
            }
        });
    }
}

Drummernaut.id = 'drummernaut';

module.exports = Drummernaut;
