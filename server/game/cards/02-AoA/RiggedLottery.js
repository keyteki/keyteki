const Card = require('../../Card.js');

class RiggedLottery extends Card {
    // Play: Each player discards the top 5cards of their deck. For each Shadows card discarded, its owner gains 1A.
    setupCardAbilities(ability) {
        this.play({
            gameAction: [
                ability.actions.discard((context) => ({
                    target:
                        context.player.deck.length > 0
                            ? context.player.deck.slice(0, Math.min(5, context.player.deck.length))
                            : []
                })),
                ability.actions.discard((context) => ({
                    target:
                        context.player.opponent.deck.length > 0
                            ? context.player.opponent.deck.slice(
                                  0,
                                  Math.min(5, context.player.opponent.deck.length)
                              )
                            : []
                }))
            ],
            then: (preThenContext) => {
                let myCards =
                    preThenContext.player.deck.length > 0
                        ? preThenContext.player.deck.slice(
                              0,
                              Math.min(5, preThenContext.player.deck.length)
                          )
                        : [];
                let theirCards =
                    preThenContext.player.opponent.deck.length > 0
                        ? preThenContext.player.opponent.deck.slice(
                              0,
                              Math.min(5, preThenContext.player.opponent.deck.length)
                          )
                        : [];
                return {
                    message:
                        "{0} discards {3} from {4}'s deck, and {4} gains {5} amber. They also discard {6} from {7}'s deck and {7} gains {8} amber",
                    messageArgs: [
                        myCards,
                        preThenContext.player,
                        myCards.filter((card) => card.hasHouse('shadows')).length,
                        theirCards,
                        preThenContext.player.opponent,
                        theirCards.filter((card) => card.hasHouse('shadows')).length
                    ],
                    gameAction: [
                        ability.actions.gainAmber({
                            amount: myCards.filter((card) => card.hasHouse('shadows')).length,
                            target: preThenContext.player
                        }),
                        ability.actions.gainAmber({
                            amount: theirCards.filter((card) => card.hasHouse('shadows')).length,
                            target: preThenContext.player.opponent
                        })
                    ]
                };
            }
        });
    }
}

RiggedLottery.id = 'rigged-lottery';

module.exports = RiggedLottery;
