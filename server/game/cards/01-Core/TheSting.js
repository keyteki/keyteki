const Card = require('../../Card.js');

class TheSting extends Card {
    // Skip your forge a key step.
    // You get all A spent by your opponent when forging keys.
    // Action: Sacrifice The Sting.
    setupCardAbilities(ability) {
        this.persistentEffect({
            effect: ability.effects.skipStep('key')
        });

        this.persistentEffect({
            targetController: 'opponent',
            effect: ability.effects.redirectForgeAmber()
        });

        this.action({
            gameAction: ability.actions.sacrifice()
        });
    }
}

TheSting.id = 'the-sting';

module.exports = TheSting;
