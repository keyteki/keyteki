const Card = require('../../Card.js');

class BloodMoney extends Card {
    setupCardAbilities(ability) {
        this.play({
            target: {
                cardType: 'creature',
                controller: 'opponent',
                gameAction: ability.actions.placeAmber({ amount: 2 })
            }
        });
    }
}

BloodMoney.id = 'blood-money';

module.exports = BloodMoney;
