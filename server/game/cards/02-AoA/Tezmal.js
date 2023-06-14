const Card = require('../../Card.js');

class Tezmal extends Card {
    // Elusive.(The first time this creature is attacked each turn, no damage is dealt.)
    // Reap: Choose a house. Your opponent cannot choose that house as their active house on their next turn.
    setupCardAbilities(ability) {
        this.reap({
            condition: (context) => !!context.player.opponent,
            target: {
                mode: 'house'
            },
            effect: 'stop {1} from choosing {2} as their active house',
            effectArgs: (context) => [context.player.opponent, context.house],
            gameAction: ability.actions.nextRoundEffect((context) => ({
                targetController: 'opponent',
                effect: ability.effects.stopHouseChoice(context.house)
            }))
        });
    }
}

Tezmal.id = 'tezmal';

module.exports = Tezmal;
