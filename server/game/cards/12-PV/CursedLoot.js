const Card = require('../../Card.js');

class CursedLoot extends Card {
    // Treachery.
    // After you play a card, discard a random card from your hand. If you have no cards in your hand, destroy Cursed Loot.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardPlayed: (event, context) => event.player === context.player
            },
            gameAction: ability.actions.discardAtRandom((context) => ({
                target: context.player
            })),
            then: {
                alwaysTriggers: true,
                condition: (context) => context.player.hand.length === 0,
                gameAction: ability.actions.destroy(),
                message: '{0} uses {1} to destroy itself as {0} has no cards in hand'
            }
        });
    }
}

CursedLoot.id = 'cursed-loot';

module.exports = CursedLoot;
