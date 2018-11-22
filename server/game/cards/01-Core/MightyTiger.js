const Card = require('../../Card.js');

class MightyTiger extends Card {
    setupCardAbilities(ability) {
        this.play({
            target: {
                cardType: 'creature',
                controller: 'opponent',
                gameAction: ability.actions.dealDamage({ amount: 4 })
            }
        });
    }
}

MightyTiger.id = 'mighty-tiger'; // This is a guess at what the id might be - please check it!!!

module.exports = MightyTiger;
