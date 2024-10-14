const Card = require('../../Card.js');

class SurvivalOfTheRichest extends Card {
    // Play: Make a token creature. If you have more A than your opponent,
    // archive Survival of the Richest.
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.makeTokenCreature(),
            then: {
                alwaysTriggers: true,
                condition: (context) =>
                    context.player.opponent && context.player.amber > context.player.opponent.amber,
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

SurvivalOfTheRichest.id = 'survival-of-the-richest';

module.exports = SurvivalOfTheRichest;
