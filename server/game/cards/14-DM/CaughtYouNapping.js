const Card = require('../../Card.js');

class CaughtYouNapping extends Card {
    // Play: If you are overwhelmed, exhaust an enemy creature. Steal 1 for each exhausted enemy creature.
    setupCardAbilities(ability) {
        const exhaustedEnemyCount = (context) =>
            context.player.opponent
                ? context.player.opponent.creaturesInPlay.filter((card) => card.exhausted).length
                : 0;

        this.play({
            target: {
                cardCondition: (_, context) => context.player.isOverwhelmed(),
                cardType: 'creature',
                controller: 'opponent',
                gameAction: ability.actions.exhaust()
            },
            then: {
                alwaysTriggers: true,
                gameAction: ability.actions.steal((context) => ({
                    amount: exhaustedEnemyCount(context)
                })),
                message: '{0} uses {1} to steal {3} amber',
                messageArgs: (context) => [
                    Math.min(exhaustedEnemyCount(context), context.player.opponent?.amber ?? 0)
                ]
            }
        });
    }
}

CaughtYouNapping.id = 'caught-you-napping';

module.exports = CaughtYouNapping;
