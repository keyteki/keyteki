const TokenCard = require('../../TokenCard.js');

class Priest extends TokenCard {
    // Action: Exhaust an enemy creature.
    setupCardAbilities(ability) {
        this.action({
            reap: true,
            target: {
                controller: 'opponent',
                cardType: 'creature',
                gameAction: ability.actions.exhaust()
            }
        });
    }
}

Priest.id = 'priest';

module.exports = Priest;
