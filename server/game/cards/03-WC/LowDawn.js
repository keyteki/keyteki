const Card = require('../../Card.js');

class LowDawn extends Card {
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
