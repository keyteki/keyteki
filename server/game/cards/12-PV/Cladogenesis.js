const Card = require('../../Card.js');

class Cladogenesis extends Card {
    // Play: Each player discards the top card of their deck and reveals their hand. Discard each card that belongs to their discarded card's house. Each player refills their hand as if it were their "draw cards" step.
    setupCardAbilities(ability) {
        // Only the cards discarded from the top of a deck by this ability count;
        // a player with an empty deck discards nothing and so matches no house.
        const cardsToDiscard = (player, context) => {
            const discardedTop = context.preThenEvents
                .filter((event) => event.player === player && event.cards)
                .flatMap((event) => event.cards);
            return player.hand.filter((card) =>
                discardedTop.some((top) => top.getHouses().some((house) => card.hasHouse(house)))
            );
        };

        this.play({
            effect: "discard the top card of each player's deck, reveal each player's hand, and discard cards belonging to each player's discarded card's house",
            gameAction: [
                ability.actions.discardTopOfDeck((context) => ({
                    target: context.player
                })),
                ability.actions.discardTopOfDeck((context) => ({
                    target: context.player.opponent
                }))
            ],
            then: {
                alwaysTriggers: true,
                gameAction: ability.actions.sequential([
                    ability.actions.reveal((context) => ({
                        target: context.player.hand,
                        chatMessage: true
                    })),
                    ability.actions.reveal((context) => ({
                        target: context.player.opponent ? context.player.opponent.hand : [],
                        chatMessage: true
                    })),
                    ability.actions.discard((context) => ({
                        target: cardsToDiscard(context.player, context)
                    })),
                    ability.actions.discard((context) => ({
                        target: context.player.opponent
                            ? cardsToDiscard(context.player.opponent, context)
                            : []
                    }))
                ]),
                then: {
                    alwaysTriggers: true,
                    gameAction: ability.actions.draw((context) => ({
                        target: context.game.getPlayers(),
                        refill: true
                    })),
                    message: '{0} uses {1} to have each player refill their hand'
                }
            }
        });
    }
}

Cladogenesis.id = 'cladogenesis';

module.exports = Cladogenesis;
