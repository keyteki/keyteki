const Card = require('../../Card.js');

class HonorableAbagnale extends Card {
    // Elusive.
    // You may spend up to 3A from your opponent's pool when forging keys.
    setupCardAbilities(ability) {
        this.persistentEffect({
            effect: ability.effects.forgeWithOpponentsAmber(3)
        });
    }
}

HonorableAbagnale.id = 'honorable-abagnale';

module.exports = HonorableAbagnale;
