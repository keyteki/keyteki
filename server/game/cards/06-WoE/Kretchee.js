const Card = require('../../Card.js');

class Kretchee extends Card {
    setupCardAbilities(ability) {
        this.persistentEffect({
            targetController: 'any',
            effect: [ability.effects.captureMoreFromPool(1), ability.effects.exaltMoreFromPool(1)]
        });
    }
}

Kretchee.id = 'kretchee';

module.exports = Kretchee;
