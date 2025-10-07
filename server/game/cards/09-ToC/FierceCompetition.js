import Card from '../../Card.js';

class FierceCompetition extends Card {
    // Play: Make a token creature. If you and your opponent have the same
    // number of forged keys, archive Fierce Competition.
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.makeTokenCreature(),
            then: {
                alwaysTriggers: true,
                condition: (context) =>
                    context.player.opponent &&
                    context.player.getForgedKeys() === context.player.opponent.getForgedKeys(),
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

FierceCompetition.id = 'fierce-competition';

export default FierceCompetition;
