const Card = require('../../Card.js');

class Gravelguts extends Card {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onDamageDealt: (event, context) => event.damageSource === context.source && event.destroyed
            },
            gameAction: ability.actions.addPowerCounter({
                amount: 2
            })
        });
    }
}

Gravelguts.id = 'gravelguts';

module.exports = Gravelguts;
