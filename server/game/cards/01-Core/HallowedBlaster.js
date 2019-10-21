const Card = require('../../Card.js');

class HallowedBlaster extends Card {
    setupCardAbilities(ability) {
        this.action({
            target: {
                cardType: 'creature',
                gameAction: ability.actions.heal({ amount: 3 })
            }
        });
    }
}

HallowedBlaster.id = 'hallowed-blaster';

module.exports = HallowedBlaster;
