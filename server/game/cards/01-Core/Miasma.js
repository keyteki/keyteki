const Card = require('../../Card.js');

class Miasma extends Card {
    // Play: Your opponent skips the forge a key step on their next turn.
    setupCardAbilities(ability) {
        this.play({
            condition: (context) => !!context.player.opponent,
            effect: 'make {1} skip their key step next turn',
            effectArgs: (context) => context.player.opponent,
            gameAction: ability.actions.untilEndOfOpponentNextTurn({
                targetController: 'opponent',
                effect: ability.effects.skipStep('key')
            })
        });
    }
}

Miasma.id = 'miasma';

module.exports = Miasma;
