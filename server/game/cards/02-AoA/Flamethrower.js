const Card = require('../../Card.js');

class Flamethrower extends Card {
    // Action: Deal 1D to a creature,
    // with 1D splash.
    setupCardAbilities(ability) {
        this.action({
            target: {
                cardType: 'creature',
                gameAction: ability.actions.dealDamage({
                    amount: 1,
                    splash: 1
                })
            }
        });
    }
}

Flamethrower.id = 'flamethrower';

module.exports = Flamethrower;
