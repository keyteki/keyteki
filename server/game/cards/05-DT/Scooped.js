import Card from '../../Card.js';

class Scooped extends Card {
    // Play: Deal 2D to a creature. If it is not destroyed, it captures 1A from its own side.
    setupCardAbilities(ability) {
        this.play({
            target: {
                cardType: 'creature',
                gameAction: ability.actions.dealDamage({ amount: 2 })
            },
            then: (preThenContext) => ({
                alwaysTriggers: true,
                condition: (context) =>
                    !(
                        context.preThenEvent.destroyEvent &&
                        context.preThenEvent.destroyEvent.resolved
                    ),
                message: '{0} uses {1} to capture 1 amber from {3} on {4}',
                messageArgs: () => [preThenContext.target.controller, preThenContext.target],
                gameAction: ability.actions.capture(() => ({
                    target: preThenContext.target,
                    amount: 1,
                    player: preThenContext.target.controller
                }))
            })
        });
    }
}

Scooped.id = 'scooped';

export default Scooped;
