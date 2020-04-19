const Card = require('../../Card.js');

class SafeHouse extends Card {
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
