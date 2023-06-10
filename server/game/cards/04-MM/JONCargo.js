const Card = require('../../Card.js');

class JONCargo extends Card {
    // Reap: Discard the top card of your deck and reveal your hand. Archive each card that shares a house with the discarded card.
    setupCardAbilities(ability) {
        this.reap({
            effect: 'discard {1} and reveal {2}',
            effectArgs: (context) => [
                context.player.deck.length > 0 ? context.player.deck[0] : null,
                context.player.hand.length > 0 ? context.player.hand : 'an empty hand'
            ],
            gameAction: ability.actions.discard((context) => ({
                target: context.player.deck.length > 0 ? context.player.deck[0] : []
            })),
            then: {
                gameAction: ability.actions.archive((context) => ({
                    target: context.player.hand.filter((card) =>
                        context.preThenEvent.card.getHouses().some((house) => card.hasHouse(house))
                    )
                }))
            }
        });
    }
}

JONCargo.id = 'jon-cargo';

module.exports = JONCargo;
