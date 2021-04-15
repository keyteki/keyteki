const Card = require('../../Card.js');

class Fuguru extends Card {
    // Poison.
    // Your opponent refills their hand to 1 less card during their “draw cards” step.
    setupCardAbilities(ability) {
        this.persistentEffect({
            targetController: 'opponent',
            effect: ability.effects.modifyHandSize(-1)
        });
    }
}

Fuguru.id = 'fuguru';

module.exports = Fuguru;
