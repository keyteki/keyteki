const Card = require('../../Card.js');

class Snaglet extends Card {
    // Elusive.
    // Action: Choose a house. If your opponent chooses that house as their active house on their next turn, steal 2A.
    setupCardAbilities(ability) {
        this.action({
            target: {
                mode: 'house'
            },
            effect: 'steal 2 amber from {1} if they choose {2} as their active house next turn',
            effectArgs: (context) => [context.player.opponent, context.house],
            gameAction: ability.actions.nextRoundEffect((context) => ({
                targetController: 'opponent',
                when: {
                    onChooseActiveHouse: (event) =>
                        event.player !== context.player && event.house === context.house
                },
                gameAction: ability.actions.steal({
                    target: context.player.opponent,
                    amount: 2
                })
            }))
        });
    }
}

Snaglet.id = 'snaglet';

module.exports = Snaglet;
