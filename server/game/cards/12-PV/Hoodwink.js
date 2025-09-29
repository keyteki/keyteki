const Card = require('../../Card.js');

class Hoodwink extends Card {
    // Play: Reveal your hand. For each non-Shadows card revealed this way, steal 1. Purge Hoodwink.
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.reveal((context) => ({
                target: context.player.hand
            })),
            then: {
                alwaysTriggers: true,
                gameAction: ability.actions.steal((context) => ({
                    amount: context.player.hand.filter((card) => !card.hasHouse('shadows')).length
                })),
                message: '{0} uses {1} to steal {3} amber',
                messageArgs: (context) => [
                    Math.min(
                        context.player.opponent.amber,
                        context.player.hand.filter((card) => !card.hasHouse('shadows')).length
                    )
                ],
                then: {
                    alwaysTriggers: true,
                    gameAction: ability.actions.purge(),
                    message: '{0} uses {1} to purge {1}'
                }
            }
        });
    }
}

Hoodwink.id = 'hoodwink';

module.exports = Hoodwink;
