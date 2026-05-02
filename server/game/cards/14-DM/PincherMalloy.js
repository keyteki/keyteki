const Card = require('../../Card.js');

class PincherMalloy extends Card {
    // Play: If your opponent has more amber than you, steal 2A.
    setupCardAbilities(ability) {
        this.play({
            condition: (context) =>
                !!context.player.opponent && context.player.opponent.amber > context.player.amber,
            gameAction: ability.actions.steal({ amount: 2 })
        });
    }
}

PincherMalloy.id = 'pincher-malloy';

module.exports = PincherMalloy;
