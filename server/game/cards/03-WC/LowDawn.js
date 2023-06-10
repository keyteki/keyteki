const Card = require('../../Card.js');

class LowDawn extends Card {
    // Play: If there are 3 or more Untamed creatures in your discard pile, gain 2A. Shuffle each Untamed creature from your discard pile into your deck.
    setupCardAbilities(ability) {
        this.play({
            gameAction: [
                ability.actions.gainAmber((context) => ({
                    amount:
                        context.player.discard.filter(
                            (card) => card.type === 'creature' && card.hasHouse('untamed')
                        ).length >= 3
                            ? 2
                            : 0
                })),
                ability.actions.returnToDeck((context) => ({
                    shuffle: true,
                    target: context.player.discard.filter(
                        (card) => card.type === 'creature' && card.hasHouse('untamed')
                    )
                }))
            ]
        });
    }
}

LowDawn.id = 'low-dawn';

module.exports = LowDawn;
