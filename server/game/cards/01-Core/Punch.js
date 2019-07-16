const Card = require('../../Card.js');

class Punch extends Card {
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
