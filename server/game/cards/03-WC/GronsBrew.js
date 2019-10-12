const Card = require('../../Card.js');

class GronsBrew extends Card {
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

GronsBrew.id = 'gron-s-brew';

module.exports = GronsBrew;
