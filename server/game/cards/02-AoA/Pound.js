const Card = require('../../Card.js');

class Pound extends Card {
    setupCardAbilities(ability) {
        this.play({
            target: {
                cardType: 'creature',
                gameAction: ability.actions.dealDamage({
                    amount: 2,
                    splash: 1
                })
            }
        });
    }
}

Pound.id = 'pound';

module.exports = Pound;
