const Card = require('../../Card.js');

class CrimTorchtooth extends Card {
    // After Fight: Enrage with each of Crim Torchtooth's neighbors.
    setupCardAbilities(ability) {
        this.fight({
            effect: 'enrage each of its neighbors',
            gameAction: ability.actions.enrage((context) => ({
                target: context.source.neighbors
            }))
        });
    }
}

CrimTorchtooth.id = 'crim-torchtooth';

module.exports = CrimTorchtooth;
