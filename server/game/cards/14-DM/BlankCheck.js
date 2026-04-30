const Card = require('../../Card.js');

class BlankCheck extends Card {
    // Play: Each player shuffles their archives and discard pile into their deck.
    // Discard the top 5 cards of your opponent's deck. Play the top card of their deck as if it were yours.
    setupCardAbilities(ability) {
        const playerShuffle = (context) =>
            ability.actions.returnToDeck({
                shuffle: true,
                shuffleDiscardIntoDeck: true,
                target: context.player.archives.concat(context.player.discard)
            });
        const opponentShuffle = (context) =>
            ability.actions.returnToDeck({
                shuffle: true,
                shufflePlayer: context.player.opponent,
                shuffleDiscardIntoDeck: true,
                target: context.player.opponent.archives.concat(context.player.opponent.discard)
            });
        this.play({
            gameAction: ability.actions.conditional((context) => ({
                condition: !!context.player.opponent,
                trueGameAction: context.player.optionSettings.orderForcedAbilities
                    ? ability.actions.chooseAction({
                          activePromptTitle:
                              'Choose which player shuffles their archives and discard pile first',
                          choices: {
                              Me: [playerShuffle(context), opponentShuffle(context)],
                              Opponent: [opponentShuffle(context), playerShuffle(context)]
                          }
                      })
                    : ability.actions.sequential([
                          playerShuffle(context),
                          opponentShuffle(context)
                      ]),
                falseGameAction: playerShuffle(context)
            })),
            then: (preThenContext) =>
                preThenContext.player.opponent
                    ? {
                          alwaysTriggers: true,
                          gameAction: ability.actions.sequential([
                              ability.actions.discard((context) => ({
                                  target: context.player.opponent.deck.slice(0, 5)
                              })),
                              ability.actions.playCard((context) => ({
                                  revealOnIllegalTarget: true,
                                  target: context.player.opponent.deck[0]
                              }))
                          ])
                      }
                    : null
        });
    }
}

BlankCheck.id = 'blank-check';

module.exports = BlankCheck;
