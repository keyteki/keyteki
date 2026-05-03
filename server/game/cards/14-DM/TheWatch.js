const Card = require('../../Card.js');

class TheWatch extends Card {
    // Elusive. Entrench.
    // While The Watch is exhausted, your amber cannot be stolen.
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => this.exhausted,
            effect: ability.effects.playerCannot('steal')
        });
    }
}

TheWatch.id = 'the-watch';

module.exports = TheWatch;
