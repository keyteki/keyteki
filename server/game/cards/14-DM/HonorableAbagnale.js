const Card = require('../../Card.js');

class HonorableAbagnale extends Card {
    // Elusive.
    // You may spend up to 3 from your opponent's pool when forging keys.
    setupCardAbilities(ability) {
        this.persistentEffect({
            effect: ability.effects.forgeAmberFromOpponentPool(3)
        });
    }
}

HonorableAbagnale.id = 'honorable-abagnale';

module.exports = HonorableAbagnale;
