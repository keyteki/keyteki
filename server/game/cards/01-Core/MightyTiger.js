const Card = require('../../Card.js');

class MightyTiger extends Card {
    // Play: Deal 4D to an enemy creature.
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

MightyTiger.id = 'mighty-tiger';

module.exports = MightyTiger;
