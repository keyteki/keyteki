const Card = require('../../Card.js');

class Mugwump extends Card {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onDamageDealt: (event, context) => event.damageSource === context.source && event.destroyed
            },
            gameAction: [
                ability.actions.heal({ fully: true }),
                ability.actions.addPowerCounter()
            ]
        });
    }
}

Mugwump.id = 'mugwump'; // This is a guess at what the id might be - please check it!!!

module.exports = Mugwump;
