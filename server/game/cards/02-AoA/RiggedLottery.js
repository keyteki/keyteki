const Card = require('../../Card.js');

class RiggedLottery extends Card {
    // Play: Each player discards the top 5 cards of their deck. For each Shadows card discarded, its owner gains 1A.
    setupCardAbilities(ability) {
        this.play({
            gameAction: [
                ability.actions.discard((context) => ({
                    chatMessage: false,
                    target:
                        context.player.deck.length > 0
                            ? context.player.deck.slice(0, Math.min(5, context.player.deck.length))
                            : []
                })),
                ability.actions.discard((context) => ({
                    chatMessage: false,
                    target:
                        context.player.opponent && context.player.opponent.deck.length > 0
                            ? context.player.opponent.deck.slice(
                                  0,
                                  Math.min(5, context.player.opponent.deck.length)
                              )
                            : []
                }))
            ],
            then: (preThenContext) => {
                const myCards =
                    preThenContext.player.deck.length > 0
                        ? preThenContext.player.deck.slice(
                              0,
                              Math.min(5, preThenContext.player.deck.length)
                          )
                        : [];
                const theirCards =
                    preThenContext.player.opponent && preThenContext.player.opponent.deck.length > 0
                        ? preThenContext.player.opponent.deck.slice(
                              0,
                              Math.min(5, preThenContext.player.opponent.deck.length)
                          )
                        : [];
                return {
                    message:
                        '{3} discards the top 5 cards of their deck ({4}) and gains {5} amber. {6} discards the top 5 cards of their deck ({7}) and gains {8} amber',
                    messageArgs: [
                        preThenContext.player,
                        myCards,
                        myCards.filter((card) => card.hasHouse('shadows')).length,
                        preThenContext.player.opponent,
                        theirCards,
                        theirCards.filter((card) => card.hasHouse('shadows')).length
                    ],
                    gameAction: [
                        ability.actions.gainAmber({
                            amount: myCards.filter((card) => card.hasHouse('shadows')).length,
                            target: preThenContext.player
                        }),
                        ...(preThenContext.player.opponent
                            ? [
                                  ability.actions.gainAmber({
                                      amount: theirCards.filter((card) => card.hasHouse('shadows'))
                                          .length,
                                      target: preThenContext.player.opponent
                                  })
                              ]
                            : [])
                    ]
                };
            }
        });
    }
}

RiggedLottery.id = 'rigged-lottery';

module.exports = RiggedLottery;
