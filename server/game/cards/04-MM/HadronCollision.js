const Card = require('../../Card.js');

class HadronCollision extends Card {
    setupCardAbilities(ability) {
        this.play({
            target: {
                cardType: 'creature',
                gameAction: ability.actions.sequential([
                    ability.actions.removeWardToken(),
                    ability.actions.dealDamage({
                        amount: 3,
                        ignoreArmor: true
                    })
                ])
            }
        });
    }
}

HadronCollision.id = 'hadron-collision';

module.exports = HadronCollision;
