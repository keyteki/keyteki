const Card = require('../../Card.js');

class LavaBall extends Card {
    // Play: Deal 4D to a creature,
    // with 2D splash.
    setupCardAbilities(ability) {
        this.play({
            target: {
                cardType: 'creature',
                gameAction: ability.actions.dealDamage({
                    amount: 4,
                    splash: 2
                })
            }
        });
    }
}

LavaBall.id = 'lava-ball';

module.exports = LavaBall;
