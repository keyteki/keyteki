const Card = require('../../Card.js');

class HallowedBlaster extends Card {
    // Action: Heal 3 damage from a creature.
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
