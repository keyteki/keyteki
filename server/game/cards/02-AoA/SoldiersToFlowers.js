const Card = require('../../Card.js');

class SoldiersToFlowers extends Card {
    // Play: Purge each Untamed creature from each players discard pile. For each card purged this way, its owner gains 1A.
    setupCardAbilities(ability) {
        this.play({
            condition: (context) => !!context.player.opponent,
            gameAction: [
                ability.actions.gainAmber((context) => ({
                    amount: context.player.discard.filter(
                        (card) => card.type === 'creature' && card.hasHouse('untamed')
                    ).length
                })),
                ability.actions.purge((context) => ({
                    location: 'discard',
                    target: context.player.discard.filter(
                        (card) => card.type === 'creature' && card.hasHouse('untamed')
                    )
                })),
                ability.actions.gainAmber((context) => ({
                    amount: context.player.opponent.discard.filter(
                        (card) => card.type === 'creature' && card.hasHouse('untamed')
                    ).length,
                    target: context.player.opponent
                })),
                ability.actions.purge((context) => ({
                    location: 'discard',
                    target: context.player.opponent.discard.filter(
                        (card) => card.type === 'creature' && card.hasHouse('untamed')
                    )
                }))
            ]
        });
    }
}

SoldiersToFlowers.id = 'soldiers-to-flowers';

module.exports = SoldiersToFlowers;
