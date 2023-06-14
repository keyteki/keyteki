const Card = require('../../Card.js');

class SenatorShrix extends Card {
    // You may spend A on Senator Shrix as if it were in your pool.
    // Play/Reap: You may exalt Senator Shrix.
    setupCardAbilities(ability) {
        this.persistentEffect({
            effect: ability.effects.keyAmber()
        });

        this.play({
            reap: true,
            optional: true,
            gameAction: ability.actions.exalt((context) => ({
                target: context.source
            }))
        });
    }
}

SenatorShrix.id = 'senator-shrix';

module.exports = SenatorShrix;
