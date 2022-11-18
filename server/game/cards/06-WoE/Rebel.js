const Card = require('../../Card.js');

class Rebel extends Card {
    //Reap: Deal 1 D to a creature.
    setupCardAbilities(ability) {
        this.reap({
            target: {
                cardType: 'creature',
                gameAction: ability.actions.dealDamage({ amount: 1 })
            }
        });
    }
}

Rebel.id = 'rebel';

module.exports = Rebel;
