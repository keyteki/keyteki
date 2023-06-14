const Card = require('../../Card.js');

class Raider extends Card {
    // Raider gains poison during your turn.
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: (context) => context.player === this.game.activePlayer,
            effect: ability.effects.addKeyword({ poison: 1 })
        });
    }
}

Raider.id = 'raider';

module.exports = Raider;
