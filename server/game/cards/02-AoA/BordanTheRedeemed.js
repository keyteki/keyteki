const Card = require('../../Card.js');

class BordanTheRedeemed extends Card {
    // Elusive.(The first time this creature is attacked each turn, no damage is dealt.)
    // Action: Capture 2A.
    setupCardAbilities(ability) {
        this.action({
            gameAction: ability.actions.capture({ amount: 2 })
        });
    }
}

BordanTheRedeemed.id = 'bordan-the-redeemed';

module.exports = BordanTheRedeemed;
