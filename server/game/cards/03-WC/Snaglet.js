const Card = require('../../Card.js');

class Snaglet extends Card {
    setupCardAbilities(ability) {
        this.action({
            target: {
                mode: 'house'
            },
            effect: 'steal an amber from {1} if they choose {2} as their active house next turn',
            effectArgs: context => [context.player.opponent, context.house],
            gameAction: ability.actions.lastingEffect(context => ({
                when: {
                    onChooseActiveHouse: event => event.player !== context.player && event.house === context.house
                },
                gameAction: ability.actions.steal({ amount: 2 })
            }))
        });
    }
}

Snaglet.id = 'snaglet';

module.exports = Snaglet;
