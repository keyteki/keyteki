import Card from '../../Card.js';

class Placeholder extends Card {
    // Move a creature to a flank of its controller’s battleline and
    // deal 2D to it. If it is not destroyed, repeat the preceding effect.
    setupCardAbilities(ability) {
        this.play({
            effect: 'move {1} to a flank and deal 2 damage to it',
            effectArgs: (context) => context.target,
            target: {
                cardType: 'creature',
                gameAction: ability.actions.sequential([
                    ability.actions.moveToFlank(),
                    ability.actions.dealDamage({
                        amount: 2
                    })
                ])
            },
            then: (preThenContext) => ({
                alwaysTriggers: true,
                condition: () => preThenContext.target.location === 'play area',
                message: '{0} uses {1} to move {3} to a flank and deal 2 damage to it',
                messageArgs: (context) => context.target,
                target: {
                    cardType: 'creature',
                    gameAction: ability.actions.sequential([
                        ability.actions.moveToFlank(),
                        ability.actions.dealDamage({
                            amount: 2
                        })
                    ])
                }
            })
        });
    }
}

Placeholder.id = 'placeholder';

export default Placeholder;
