const Card = require('../../Card.js');

class Kretchee extends Card {
    setupCardAbilities(ability) {
        this.persistentEffect({
            targetController: 'any',
            effect: [
                ability.effects.captureOneMoreFromPool(),
                ability.effects.exaltOneMoreFromPool()
            ]
        });
    }
}

Kretchee.id = 'kretchee';

module.exports = Kretchee;
