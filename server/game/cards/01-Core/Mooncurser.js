const Card = require('../../Card.js');

class Mooncurser extends Card {
    // Skirmish. Poison.
    // Fight: Steal 1<A>.
    setupCardAbilities(ability) {
        this.fight({
            gameAction: ability.actions.steal()
        });
    }
}

Mooncurser.id = 'mooncurser';

module.exports = Mooncurser;
