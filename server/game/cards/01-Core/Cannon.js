const Card = require('../../Card.js');

class Cannon extends Card {
    setupCardAbilities(ability) {
        this.action({
            target: {
                cardType: 'creature',
                gameAction: ability.actions.dealDamage({ amount: 2 })
            }
        });
    }
}

Cannon.id = 'cannon'; // This is a guess at what the id might be - please check it!!!

module.exports = Cannon;
