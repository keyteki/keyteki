const Card = require('../../Card.js');

class BlankCheck extends Card {
    // Play: Each player shuffles their archives and discard pile into their deck. Discard the top 5 cards of your opponent's deck. Play the top card of their deck as if it were yours.
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
            effect: 'have each player shuffle their archives and discard pile into their deck',
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
            then: () => ({
                alwaysTriggers: true,
                gameAction: ability.actions.conditional((context) => ({
                    condition: !!context.player.opponent,
                    trueGameAction: ability.actions.sequential([
                        ability.actions.discardTopOfDeck((context) => ({
                            target: context.player.opponent,
                            amount: 5
                        })),
                        ability.actions.playCard((context) => ({
                            revealOnIllegalTarget: true,
                            target: context.player.opponent.deck[0]
                        }))
                    ])
                }))
            })
        });
    }
}

BlankCheck.id = 'blank-check';

module.exports = BlankCheck;
