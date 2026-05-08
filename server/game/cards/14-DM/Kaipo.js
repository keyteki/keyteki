const Card = require('../../Card.js');

class Kaipo extends Card {
    // Taunt.
    // At the end of your turn, fully heal each of Kaipo's neighbors.
    setupCardAbilities(ability) {
        this.interrupt({
            when: {
                onTurnEnd: (_, context) => context.player === this.game.activePlayer
            },
            gameAction: ability.actions.heal((context) => ({
                fully: true,
                target: context.source.neighbors
            }))
        });
    }
}

Kaipo.id = 'kaipo';

module.exports = Kaipo;
