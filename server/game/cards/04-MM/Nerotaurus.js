const Card = require('../../Card.js');

class Nerotaurus extends Card {
    setupCardAbilities(ability) {
        this.fight({
            condition: (context) => !!context.player.opponent,
            effect: 'stop {1} from reaping next turn',
            effectArgs: (context) => context.player.opponent,
            gameAction: ability.actions.lastingEffect({
                targetController: 'opponent',
                effect: ability.effects.cardCannot('reap')
            })
        });

        this.reap({
            condition: (context) => !!context.player.opponent,
            effect: 'stop {1} from fighting next turn',
            effectArgs: (context) => context.player.opponent,
            gameAction: ability.actions.lastingEffect({
                targetController: 'opponent',
                effect: ability.effects.cardCannot('fight')
            })
        });
    }
}

Nerotaurus.id = 'nerotaurus';

module.exports = Nerotaurus;
