const Card = require('../../Card.js');

class TrashHeap extends Card {
    // Play: Destroy each creature. Each player reveals their hand and discards each creature revealed this way. Each player refills their hand as if it were their "draw cards" step.
    setupCardAbilities(ability) {
        const playerDiscard = (player) =>
            ability.actions.discard(() => ({
                target: player ? player.hand.filter((card) => card.type === 'creature') : []
            }));

        const discardStep = (preThenContext) => ({
            alwaysTriggers: true,
            gameAction: ability.actions.conditional(() => ({
                condition: !!preThenContext.player.opponent,
                trueGameAction: preThenContext.player.optionSettings.orderForcedAbilities
                    ? ability.actions.chooseAction({
                          activePromptTitle:
                              'Choose which player discards their revealed creatures first',
                          choices: {
                              Me: [
                                  playerDiscard(preThenContext.player),
                                  playerDiscard(preThenContext.player.opponent)
                              ],
                              Opponent: [
                                  playerDiscard(preThenContext.player.opponent),
                                  playerDiscard(preThenContext.player)
                              ]
                          }
                      })
                    : ability.actions.sequential([
                          playerDiscard(preThenContext.player),
                          playerDiscard(preThenContext.player.opponent)
                      ]),
                falseGameAction: playerDiscard(preThenContext.player)
            })),
            then: {
                alwaysTriggers: true,
                gameAction: ability.actions.draw((context) => ({
                    target: context.game.getPlayers(),
                    refill: true
                })),
                message: '{0} uses {1} to have each player refill their hand'
            }
        });

        this.play({
            effect:
                "destroy each creature, reveal each player's hand, " +
                'and discard each revealed creature',
            gameAction: ability.actions.destroy((context) => ({
                target: context.game.creaturesInPlay
            })),
            then: {
                alwaysTriggers: true,
                gameAction: ability.actions.reveal((context) => ({
                    target: context.player.hand
                })),
                message: '{0} reveals {3}',
                messageArgs: (context) => [
                    context.player.hand.length ? context.player.hand : 'nothing'
                ],
                then: (preThenContext) => {
                    const opp = preThenContext.player.opponent;
                    if (!opp) {
                        return discardStep(preThenContext);
                    }
                    if (opp.hand.length === 0) {
                        return {
                            alwaysTriggers: true,
                            message: '{3} reveals nothing',
                            messageArgs: () => [opp],
                            then: discardStep
                        };
                    }
                    return {
                        alwaysTriggers: true,
                        gameAction: ability.actions.reveal({ target: opp.hand }),
                        message: '{3} reveals {4}',
                        messageArgs: () => [opp, opp.hand],
                        then: discardStep
                    };
                }
            }
        });
    }
}

TrashHeap.id = 'trash-heap';

module.exports = TrashHeap;
