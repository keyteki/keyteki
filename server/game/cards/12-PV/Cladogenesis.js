const Card = require('../../Card.js');

class Cladogenesis extends Card {
    // Play: Each player discards the top card of their deck and reveals their hand. Discard each card that belongs to their discarded card's house. Each player refills their hand as if it were their "draw cards" step.
    setupCardAbilities(ability) {
        let playerDeckTop, oppDeckTop;

        this.play({
            effect: "discard the top card of each player's deck, reveal each player's hand, and discard cards belonging to each player's discarded card's house",
            gameAction: ability.actions.sequential([
                ability.actions.discardTopOfDeck((context) => {
                    playerDeckTop = context.player.deck[0];
                    return { target: context.player };
                }),
                ability.actions.discardTopOfDeck((context) => {
                    oppDeckTop = context.player.opponent?.deck[0];
                    return { target: context.player.opponent };
                }),
                ability.actions.reveal((context) => ({
                    target: context.player.hand,
                    chatMessage: true
                })),
                ability.actions.reveal((context) => ({
                    target: context.player.opponent ? context.player.opponent.hand : [],
                    chatMessage: true
                })),
                ability.actions.discard(() => ({
                    target: playerDeckTop
                        ? playerDeckTop.controller.hand.filter((card) =>
                              playerDeckTop.getHouses().some((h) => card.hasHouse(h))
                          )
                        : []
                })),
                ability.actions.discard(() => ({
                    target: oppDeckTop
                        ? oppDeckTop.controller.hand.filter((card) =>
                              oppDeckTop.getHouses().some((h) => card.hasHouse(h))
                          )
                        : []
                }))
            ]),
            then: {
                gameAction: ability.actions.draw((context) => ({
                    target: context.game.getPlayers(),
                    refill: true
                })),
                message: '{0} uses {1} to have each player refill their hand'
            }
        });
    }
}

Cladogenesis.id = 'cladogenesis';

module.exports = Cladogenesis;
