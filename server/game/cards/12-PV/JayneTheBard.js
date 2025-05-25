const Card = require('../../Card.js');

class JayneTheBard extends Card {
    // After Reap: Deal 2 to an enemy creature. If that creature has on it, repeat the preceding effect.
    // Scrap: Exalt 2 friendly creatures.
    setupCardAbilities(ability) {
        this.reap({
            target: {
                cardType: 'creature',
                controller: 'opponent',
                gameAction: ability.actions.dealDamage({ amount: 2 })
            },
            then: (preThenContext) => ({
                condition: () => preThenContext.target && preThenContext.target.tokens.amber > 0,
                alwaysTriggers: true,
                target: {
                    cardType: 'creature',
                    controller: 'opponent',
                    gameAction: ability.actions.dealDamage({ amount: 2 })
                },
                message: '{0} uses {1} to repeat the preceding effect and deal 2 damage to {3}',
                messageArgs: (context) => [context.target]
            })
        });

        this.scrap({
            target: {
                mode: 'exactly',
                numCards: 2,
                cardType: 'creature',
                controller: 'self',
                gameAction: ability.actions.exalt()
            }
        });
    }
}

JayneTheBard.id = 'jayne-the-bard';

module.exports = JayneTheBard;
