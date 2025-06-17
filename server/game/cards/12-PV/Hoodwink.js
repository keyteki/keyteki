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
                then: {
                    alwaysTriggers: true,
                    gameAction: ability.actions.purge()
                }
            }
        });
    }
}

Hoodwink.id = 'hoodwink';

module.exports = Hoodwink;
