import Card from '../../Card.js';

class InspiringOration extends Card {
    // Play: Exalt a friendly creature. Make a token creature for each
    // Aember on that creature.
    setupCardAbilities(ability) {
        this.play({
            target: {
                cardType: 'creature',
                controller: 'self',
                gameAction: ability.actions.exalt()
            },
            then: (preThenContext) => ({
                alwaysTriggers: true,
                message: '{0} uses {1} to make {3}{4}',
                messageArgs: () =>
                    preThenContext.target.amber === 1
                        ? ['a token creature', '']
                        : [preThenContext.target.amber, ' token creatures'],
                gameAction: ability.actions.makeTokenCreature(() => ({
                    amount: preThenContext.target.amber
                }))
            })
        });
    }
}

InspiringOration.id = 'inspiring-oration';

export default InspiringOration;
