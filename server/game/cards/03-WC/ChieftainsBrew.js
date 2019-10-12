const Card = require('../../Card.js');

class ChieftainsBrew extends Card {
    setupCardAbilities(ability) {
        this.play({
            target: {
                cardType: 'creature',
                gameAction: ability.actions.addPowerCounter({
                    amount: 2
                })
            }
        });
    }
}

ChieftainsBrew.id = 'chieftain-s-brew';

module.exports = ChieftainsBrew;
