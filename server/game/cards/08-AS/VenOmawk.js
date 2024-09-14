const Card = require('../../Card.js');

class VenOmawk extends Card {
    // During their “draw cards” step, your opponent refills their
    // hand to 1 less card.
    setupCardAbilities(ability) {
        this.persistentEffect({
            targetController: 'opponent',
            effect: ability.effects.modifyHandSize(-1)
        });
    }
}

VenOmawk.id = 'ven-omawk';

module.exports = VenOmawk;
