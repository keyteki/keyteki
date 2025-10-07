import Card from '../../Card.js';

class CallOfTheVoid extends Card {
    // Play: Exhaust a creature. If it was already exhausted, destroy it instead and its controller loses 1A.
    setupCardAbilities(ability) {
        this.play({
            target: {
                cardType: 'creature',
                gameAction: ability.actions.conditional({
                    condition: (context) => !context.target.exhausted,
                    trueGameAction: ability.actions.exhaust(),
                    falseGameAction: [
                        ability.actions.destroy(),
                        ability.actions.loseAmber((context) => ({
                            amount: 1,
                            target: context.target.controller
                        }))
                    ]
                })
            },
            effect: '{1}{0}{2}',
            effectArgs: (context) =>
                !context.target.exhausted
                    ? ['exhaust ', '']
                    : ['destroy ', ' and make its controller lose 1 amber']
        });
    }
}

CallOfTheVoid.id = 'call-of-the-void';

export default CallOfTheVoid;
