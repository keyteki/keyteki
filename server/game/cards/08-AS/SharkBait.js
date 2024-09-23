const Card = require('../../Card.js');

class SharkBait extends Card {
    // Play: Deal 2D to a friendly non-Mars creature. If it is not destroyed, it captures 2A.
    setupCardAbilities(ability) {
        this.play({
            target: {
                cardType: 'creature',
                controller: 'self',
                cardCondition: (c) => !c.hasHouse('mars'),
                gameAction: ability.actions.sequential([
                    ability.actions.dealDamage({ amount: 2 }),
                    ability.actions.conditional((context) => ({
                        condition: () => context.target.location === 'play area',
                        trueGameAction: ability.actions.capture({
                            target: context.target,
                            amount: 2
                        })
                    }))
                ])
            }
        });
    }
}

SharkBait.id = 'shark-bait';

module.exports = SharkBait;
