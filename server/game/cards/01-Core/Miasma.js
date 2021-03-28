const Card = require('../../Card.js');

class Miasma extends Card {
    setupCardAbilities(ability) {
        this.play({
            condition: (context) => !!context.player.opponent,
            effect: 'make {1} skip their key step next turn',
            effectArgs: (context) => context.player.opponent,
            gameAction: ability.actions.lastingEffect({
                targetController: 'opponent',
                effect: ability.effects.skipStep('key')
            })
        });
    }
}

Miasma.id = 'miasma';

module.exports = Miasma;
