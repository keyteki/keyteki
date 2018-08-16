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

BloodMoney.id = 'blood-money'; // This is a guess at what the id might be - please check it!!!

module.exports = BloodMoney;
