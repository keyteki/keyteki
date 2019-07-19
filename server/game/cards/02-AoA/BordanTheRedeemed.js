const Card = require('../../Card.js');

class BordanTheRedeemed extends Card {
    setupCardAbilities(ability) {
        this.action({
            gameAction: ability.actions.capture({ amount: 2 })
        });
    }
}

BordanTheRedeemed.id = 'bordan-the-redeemed'; // This is a guess at what the id might be - please check it!!!

module.exports = BordanTheRedeemed;
