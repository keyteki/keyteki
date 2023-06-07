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
            gameAction: ability.actions.nextRoundEffect((context) => ({
                targetController: 'opponent',
                when: {
                    onChooseActiveHouse: (event) =>
                        event.player !== context.player && event.house !== context.house
                },
                gameAction: ability.actions.makeTokenCreature({
                    target: context.player,
                    amount: 2,
                    ready: true
                })
            }))
        });
    }
}

WatchYourStep.id = 'watch-your-step';

module.exports = WatchYourStep;
