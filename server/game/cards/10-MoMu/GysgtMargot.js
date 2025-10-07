import Card from '../../Card.js';

class GysgtMargot extends Card {
    // After Fight/After Reap: Deal 2D to an enemy creature. Ward a
    // friendly creature.
    setupCardAbilities(ability) {
        this.reap({
            fight: true,
            target: {
                cardType: 'creature',
                controller: 'opponent',
                gameAction: ability.actions.dealDamage({ amount: 2 })
            },
            then: {
                alwaysTriggers: true,
                target: {
                    cardType: 'creature',
                    controller: 'self',
                    gameAction: ability.actions.ward()
                },
                message: '{0} uses {1} to ward {3}',
                messageArgs: (context) => [context.target]
            }
        });
    }
}

GysgtMargot.id = 'gysgt-margot';

export default GysgtMargot;
