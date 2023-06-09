const Card = require('../../Card.js');

class SafeHouse extends Card {
    // Action: Archive a friendly creature from play.
    setupCardAbilities(ability) {
        this.action({
            target: {
                cardType: 'creature',
                controller: 'self',
                gameAction: ability.actions.archive()
            }
        });
    }
}

SafeHouse.id = 'safe-house';

module.exports = SafeHouse;
