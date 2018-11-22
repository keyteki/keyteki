const Card = require('../../Card.js');

class LavaBall extends Card {
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

LavaBall.id = 'lava-ball'; // This is a guess at what the id might be - please check it!!!

module.exports = LavaBall;
