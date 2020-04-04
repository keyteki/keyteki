const Card = require('../../Card.js');

class HitAndRun extends Card {
    setupCardAbilities(ability) {
        this.play({
            targets: {
                damageCreature: {
                    cardType: 'creature',
                    cardCondition: () => true,
                    gameAction: ability.actions.dealDamage({ amount: 2 })
                }
            },
            then: {
                alwaysTriggers: true,
                targets: {
                    returnCreature: {
                        cardType: 'creature',
                        controller: 'self',
                        cardCondition: () => true,
                        gameAction: ability.actions.returnToHand()
                    }
                }
            }
        });
    }
}

HitAndRun.id = 'hit-and-run';

module.exports = HitAndRun;
