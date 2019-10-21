const Card = require('../../Card.js');

class SanctumGuardian extends Card {
    setupCardAbilities(ability) {
        this.fight({
            reap: true,
            target: {
                cardType: 'creature',
                controller: 'self',
                cardCondition: (card, context) => card !== context.source,
                gameAction: ability.actions.swap()
            }
        });
    }
}

SanctumGuardian.id = 'sanctum-guardian';

module.exports = SanctumGuardian;
