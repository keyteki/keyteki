import Card from '../../Card.js';

class SwiftInduction extends Card {
    // Play: Make a token creature. If that token creature enters play
    // adjacent to a Mutant creature, archive Swift Induction.
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.makeTokenCreature(),
            then: {
                condition: (context) =>
                    context.preThenEvent.card.neighbors.some((c) => c.hasTrait('mutant')),
                gameAction: ability.actions.archive((context) => ({
                    effect: 'archive {1}',
                    target: context.source
                })),
                message: '{0} uses {1} to archive {3}',
                messageArgs: (context) => [context.source]
            }
        });
    }
}

SwiftInduction.id = 'swift-induction';

export default SwiftInduction;
