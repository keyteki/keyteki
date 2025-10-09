const Card = require('../../Card.js');

class Nerotaurus extends Card {
    // Fight: Enemy creatures cannot reap during your opponents next turn.
    // Reap: Enemy creatures cannot fight during your opponents next turn.
    setupCardAbilities(ability) {
        this.fight({
            condition: (context) => !!context.player.opponent,
            effect: 'stop {1} from reaping next turn',
            effectArgs: (context) => context.player.opponent,
            gameAction: ability.actions.nextRoundEffect({
                targetController: 'opponent',
                effect: ability.effects.cardCannot('reap')
            })
        });

        this.reap({
            condition: (context) => !!context.player.opponent,
            effect: 'stop {1} from fighting next turn',
            effectArgs: (context) => context.player.opponent,
            gameAction: ability.actions.nextRoundEffect({
                targetController: 'opponent',
                effect: ability.effects.cardCannot('fight')
            })
        });
    }
}

Nerotaurus.id = 'nerotaurus';

module.exports = Nerotaurus;
