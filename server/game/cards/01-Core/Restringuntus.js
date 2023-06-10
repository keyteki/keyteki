const Card = require('../../Card.js');

class Restringuntus extends Card {
    // Play: Choose a house. Your opponent cannot choose that house as their active house until Restringuntus leaves play.
    setupCardAbilities(ability) {
        this.play({
            condition: (context) => !!context.player.opponent,
            target: {
                mode: 'house'
            },
            effect: 'stop {1} from choosing {2} as their active house',
            effectArgs: (context) => [context.player.opponent, context.house],
            gameAction: ability.actions.lastingEffect((context) => ({
                until: {
                    onCardLeavesPlay: (event) => event.card === context.source
                },
                targetController: 'opponent',
                effect: ability.effects.stopHouseChoice(context.house)
            }))
        });
    }
}

Restringuntus.id = 'restringuntus';

module.exports = Restringuntus;
