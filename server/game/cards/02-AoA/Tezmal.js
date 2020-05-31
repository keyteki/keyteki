const Card = require('../../Card.js');

class Tezmal extends Card {
    setupCardAbilities(ability) {
        this.reap({
            condition: (context) => !!context.player.opponent,
            target: {
                mode: 'house'
            },
            effect: 'stop {1} from choosing {2} as their active house',
            effectArgs: (context) => [context.player.opponent, context.house],
            gameAction: ability.actions.untilNextTurn((context) => ({
                targetController: 'opponent',
                effect: ability.effects.stopHouseChoice(context.house)
            }))
        });
    }
}

Tezmal.id = 'tezmal';

module.exports = Tezmal;
