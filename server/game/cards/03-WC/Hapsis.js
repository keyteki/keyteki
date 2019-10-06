const Card = require('../../Card.js');

class Hapsis extends Card {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onDamageDealt: (event, context) => event.damageSource === context.source && event.destroyed
            },
            gameAction: [
                ability.actions.ward(),
                ability.actions.draw()
            ]
        });
    }
}

Hapsis.id = 'hapsis';

module.exports = Hapsis;
