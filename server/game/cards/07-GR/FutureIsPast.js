const Card = require('../../Card.js');

class FutureIsPast extends Card {
    // Play: Swap each player's deck with their discard pile. Shuffle
    // each player's deck.
    setupCardAbilities(ability) {
        this.play({
            effect: "swap each player's deck and discard pile, and shuffle their decks",
            gameAction: [
                ability.actions.discard((context) => ({
                    target: context.player.deck.concat(
                        context.player.opponent ? context.player.opponent.deck : []
                    )
                })),
                ability.actions.returnToDeck((context) => ({
                    shuffle: true,
                    target: context.player.discard
                })),
                ability.actions.returnToDeck((context) => ({
                    shuffle: true,
                    shufflePlayer: context.player.opponent,
                    target: context.player.opponent ? context.player.opponent.discard : []
                }))
            ]
        });
    }
}

FutureIsPast.id = 'future-is-past';

module.exports = FutureIsPast;
