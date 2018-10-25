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

KindrithLongshot.id = 'kindrith-longshot'; // This is a guess at what the id might be - please check it!!!

module.exports = KindrithLongshot;
