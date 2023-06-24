const Card = require('../../Card.js');

class SanctumGuardian extends Card {
    // Taunt. (This creatures neighbors cannot be attacked unless they have taunt.)
    // Fight/Reap: Swap Sanctum Guardian with another friendly creature in your battleline.
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
