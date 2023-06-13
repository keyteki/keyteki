const Card = require('../../Card.js');

class Gamgee extends Card {
    // Elusive.(The first time this creature is attacked each turn, no damage is dealt.)
    // Reap: If your opponent has more A than you, steal 1A.
    setupCardAbilities(ability) {
        this.reap({
            condition: (context) =>
                context.player.opponent && context.player.amber < context.player.opponent.amber,
            gameAction: ability.actions.steal()
        });
    }
}

Gamgee.id = 'gamgee';

module.exports = Gamgee;
