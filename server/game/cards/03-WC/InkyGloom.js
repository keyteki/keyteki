const Card = require('../../Card.js');

class InkyGloom extends Card {
    // Play: Your opponent cannot use creatures to reap on their next turn.
    setupCardAbilities(ability) {
        this.play({
            condition: (context) => !!context.player.opponent,
            effect: 'stop {1} from reaping next turn',
            effectArgs: (context) => context.player.opponent,
            effectAlert: true,
            gameAction: ability.actions.nextRoundEffect({
                targetController: 'opponent',
                effect: ability.effects.cardCannot('reap')
            })
        });
    }
}

InkyGloom.id = 'inky-gloom';

module.exports = InkyGloom;
