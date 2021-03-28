const Card = require('../../Card.js');

class InkyGloom extends Card {
    setupCardAbilities(ability) {
        this.play({
            condition: (context) => !!context.player.opponent,
            effect: 'stop {1} from reaping next turn',
            effectArgs: (context) => context.player.opponent,
            gameAction: ability.actions.lastingEffect({
                targetController: 'opponent',
                effect: ability.effects.cardCannot('reap')
            })
        });
    }
}

InkyGloom.id = 'inky-gloom';

module.exports = InkyGloom;
