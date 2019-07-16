const Card = require('../../Card.js');

class Flamethrower extends Card {
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
