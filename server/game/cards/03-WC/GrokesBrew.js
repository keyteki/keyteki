const Card = require('../../Card.js');

class GrokesBrew extends Card {
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

GrokesBrew.id = 'groke-s-brew';

module.exports = GrokesBrew;
