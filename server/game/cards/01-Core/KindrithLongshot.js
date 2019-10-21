const Card = require('../../Card.js');

class KindrithLongshot extends Card {
    setupCardAbilities(ability) {
        this.reap({
            target: {
                cardType: 'creature',
                gameAction: ability.actions.dealDamage({ amount: 2 })
            }
        });
    }
}

KindrithLongshot.id = 'kindrith-longshot';

module.exports = KindrithLongshot;
