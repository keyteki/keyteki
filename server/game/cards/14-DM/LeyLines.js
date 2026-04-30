const Card = require('../../Card.js');

class LeyLines extends Card {
    // Play: If you are overwhelmed, exhaust each creature. Otherwise, exhaust a creature.
    setupCardAbilities(ability) {
        this.play({
            target: {
                cardCondition: (_, context) => !context.player.isOverwhelmed(),
                cardType: 'creature',
                controller: 'any',
                gameAction: ability.actions.exhaust()
            },
            then: {
                condition: (context) => context.player.isOverwhelmed(),
                alwaysTriggers: true,
                gameAction: ability.actions.exhaust((context) => ({
                    target: context.game.creaturesInPlay
                })),
                message: '{0} uses {1} to exhaust each creature'
            }
        });
    }
}

LeyLines.id = 'ley-lines';

module.exports = LeyLines;
