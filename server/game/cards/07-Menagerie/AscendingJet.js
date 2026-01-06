const Card = require('../../Card.js');

class AscendingJet extends Card {
    // Action: Give a friendly creature three +1 power counters.
    setupCardAbilities(ability) {
        this.action({
            target: {
                cardType: 'creature',
                controller: 'self',
                gameAction: ability.actions.addPowerCounter({ amount: 3 })
            }
        });
    }
}

AscendingJet.id = 'ascending-jet';

module.exports = AscendingJet;
