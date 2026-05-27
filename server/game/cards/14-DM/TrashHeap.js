const Card = require('../../Card.js');

class TrashHeap extends Card {
    // Play: Destroy each creature. Each player reveals their hand and discards each creature revealed this way. Each player refills their hand as if it were their "draw cards" step.
    setupCardAbilities(ability) {
        const revealStep = (preThenContext) => {
            if (preThenContext.player.hand.length === 0) {
                return {
                    alwaysTriggers: true,
                    message: '{0} reveals nothing',
                    then: opponentRevealStep
                };
            }
            return {
                alwaysTriggers: true,
                gameAction: ability.actions.reveal((context) => ({
                    target: context.player.hand
                })),
                message: '{0} reveals {3}',
                messageArgs: (context) => [context.player.hand],
                then: opponentRevealStep
            };
        };

        const opponentRevealStep = (preThenContext) => {
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
        };

        const discardStep = (preThenContext) => {
            const player = preThenContext.player;
            const opp = player.opponent;
            const playerHasCreatures = player.hand.some((c) => c.type === 'creature');
            const oppHasCreatures = opp && opp.hand.some((c) => c.type === 'creature');

            // If neither player has revealed creatures, skip the discard step
            // entirely and go straight to refilling hands.
            if (!playerHasCreatures && !oppHasCreatures) {
                return drawStep;
            }
            // If there's no opponent (single-player games), just discard the
            // active player's revealed creatures.
            if (!opp) {
                return {
                    alwaysTriggers: true,
                    gameAction: playerDiscard(player),
                    then: drawStep
                };
            }
            // Otherwise prompt (if enabled) for the order in which creatures
            // are discarded so that scrap reactions resolve predictably.
            return {
                alwaysTriggers: true,
                gameAction: player.optionSettings.orderForcedAbilities
                    ? ability.actions.chooseAction({
                          activePromptTitle:
                              'Choose which player discards their revealed creatures first',
                          choices: {
                              Me: [playerDiscard(player), playerDiscard(opp)],
                              Opponent: [playerDiscard(opp), playerDiscard(player)]
                          }
                      })
                    : ability.actions.sequential([playerDiscard(player), playerDiscard(opp)]),
                then: drawStep
            };
        };

        const playerDiscard = (player) =>
            ability.actions.discard(() => ({
                target: player ? player.hand.filter((card) => card.type === 'creature') : []
            }));

        const drawStep = {
            alwaysTriggers: true,
            gameAction: ability.actions.draw((context) => ({
                target: context.game.getPlayers(),
                refill: true
            })),
            message: '{0} uses {1} to have each player refill their hand'
        };

        this.play({
            effect:
                "destroy each creature, reveal each player's hand, " +
                'and discard each revealed creature',
            gameAction: ability.actions.destroy((context) => ({
                target: context.game.creaturesInPlay
            })),
            then: {
                alwaysTriggers: true,
                then: revealStep
            }
        });
    }
}

TrashHeap.id = 'trash-heap';

module.exports = TrashHeap;
