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
            },
            effect: 'remove ward and deal 3 damage to {0}'
        });
    }
}

HadronCollision.id = 'hadron-collision';

module.exports = HadronCollision;
