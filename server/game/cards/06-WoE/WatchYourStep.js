const Card = require('../../Card.js');

class WatchYourStep extends Card {
    // Play: Choose a house on your opponent's identity card. If they
    // do not choose this house as their active house during their
    // next turn, make 2 token creatures and ready them.
    setupCardAbilities(ability) {
        this.play({
            condition: (context) => !!context.player.opponent,
            target: {
                mode: 'house',
                houses: (context) => context.player.opponent.houses
            },
            effect:
                'make and ready 2 token creatures if {1} does not choose {2} as their active house next turn',
            effectArgs: (context) => [context.player.opponent, context.house],
            effectAlert: true,
            gameAction: ability.actions.untilEndOfOpponentNextTurn((context) => ({
                targetController: 'opponent',
                when: {
                    onChooseActiveHouse: (event) =>
                        event.player !== context.player && event.house !== context.house
                },
                message: '{0} uses {1} to make and ready 2 token creatures for {2}',
                messageArgs: (context) => [
                    context.player,
                    context.source,
                    context.source.controller
                ],
                gameAction: ability.actions.makeTokenCreature((context) => ({
                    player: context.player.opponent,
                    amount: 2
                })),
                then: {
                    gameAction: ability.actions.ready((context) => ({
                        target: context.preThenEvents.map((event) => event.card)
                    }))
                }
            }))
        });
    }
}

WatchYourStep.id = 'watch-your-step';

module.exports = WatchYourStep;
