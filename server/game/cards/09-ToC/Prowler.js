const Card = require('../../Card.js');

class Prowler extends Card {
    // After Reap: If your opponent has more A than you, steal 1A.
    setupCardAbilities(ability) {
        this.reap({
            condition: (context) =>
                context.player.opponent && context.player.amber < context.player.opponent.amber,
            gameAction: ability.actions.steal()
        });
    }
}

Prowler.id = 'prowler';

module.exports = Prowler;
