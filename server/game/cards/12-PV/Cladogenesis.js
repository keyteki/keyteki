const Card = require('../../Card.js');

class Cladogenesis extends Card {
    // Play: Each player discards the top card of their deck and reveals their hand. Discard each card that belongs to their discarded card's house. Each player refills their hand as if it were their "draw cards" step.
    setupCardAbilities(ability) {
        this.play({
            effect: "discard {1}, reveal each player's hand, and discard cards belonging to each player's discarded card's house",
            effectArgs: (context) => {
                let res = [];
                let myTop = context.player.deck.length > 0 ? context.player.deck[0] : '';
                if (myTop) {
                    res.push(myTop);
                }
                if (context.player.opponent && context.player.opponent.deck.length > 0) {
                    res.push(context.player.opponent.deck[0]);
                }
                if (res.length === 0) {
                    return [['nothing']];
                }
                return [res];
            },
            gameAction: ability.actions.sequential([
                ability.actions.discard((context) => ({
                    target: context.game
                        .getPlayers()
                        .filter((player) => player.deck.length > 0)
                        .map((player) => player.deck[0])
                })),
                ability.actions.reveal((context) => ({
                    target: context.player.hand,
                    chatMessage: true
                })),
                ability.actions.reveal((context) => ({
                    target: context.player.opponent ? context.player.opponent.hand : [],
                    chatMessage: true
                })),
                ability.actions.discard((context) => {
                    let myTop = context.player.discard.length > 0 ? context.player.discard[0] : '';
                    if (myTop) {
                        return {
                            target: context.player.hand.filter((card) =>
                                myTop.getHouses().some((h) => card.hasHouse(h))
                            )
                        };
                    }
                    return { target: [] };
                }),
                ability.actions.discard((context) => {
                    let oppTop =
                        context.player.opponent && context.player.opponent.discard.length > 0
                            ? context.player.opponent.discard[0]
                            : undefined;
                    if (oppTop) {
                        return {
                            target: context.player.opponent.hand.filter((card) =>
                                oppTop.getHouses().some((h) => card.hasHouse(h))
                            )
                        };
                    }
                    return { target: [] };
                })
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
