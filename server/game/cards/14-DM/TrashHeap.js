const Card = require('../../Card.js');

class TrashHeap extends Card {
    // Play: Destroy each creature. Each player reveals their hand and
    // discards each creature revealed this way. Each player refills their
    // hand as if it were their "draw cards" step.
    setupCardAbilities(ability) {
        const playerDiscard = (player) =>
            ability.actions.discard(() => ({
                target: player ? player.hand.filter((card) => card.type === 'creature') : []
            }));

        this.play({
            gameAction: ability.actions.sequential([
                ability.actions.destroy((context) => ({
                    target: context.game.creaturesInPlay
                })),
                ability.actions.reveal((context) => ({
                    target: context.player.hand,
                    chatMessage: true
                })),
                ability.actions.reveal((context) => ({
                    target: context.player.opponent ? context.player.opponent.hand : [],
                    chatMessage: true
                })),
                ability.actions.conditional((context) => ({
                    condition: !!context.player.opponent,
                    trueGameAction: context.player.optionSettings.orderForcedAbilities
                        ? ability.actions.chooseAction({
                              activePromptTitle:
                                  'Choose which player discards their revealed creatures first',
                              choices: {
                                  Me: [
                                      playerDiscard(context.player),
                                      playerDiscard(context.player.opponent)
                                  ],
                                  Opponent: [
                                      playerDiscard(context.player.opponent),
                                      playerDiscard(context.player)
                                  ]
                              }
                          })
                        : ability.actions.sequential([
                              playerDiscard(context.player),
                              playerDiscard(context.player.opponent)
                          ]),
                    falseGameAction: playerDiscard(context.player)
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
        });
    }
}

TrashHeap.id = 'trash-heap';

module.exports = TrashHeap;
