const Card = require('../../Card.js');

class Shooler extends Card {
    // Play: If your opponent has 4A or more, steal 1A.
    setupCardAbilities(ability) {
        this.play({
            condition: (context) => context.player.opponent && context.player.opponent.amber >= 4,
            gameAction: ability.actions.steal()
        });
    }
}

Shooler.id = 'shooler';

module.exports = Shooler;
