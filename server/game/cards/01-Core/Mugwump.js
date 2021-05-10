const Card = require('../../Card.js');

class Mugwump extends Card {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardDestroyed: (event, context) =>
                    event.destroyedFighting && event.damageEvent.damageSource === context.source
            },
            gameAction: [ability.actions.heal({ fully: true }), ability.actions.addPowerCounter()]
        });
    }
}

Mugwump.id = 'mugwump';

module.exports = Mugwump;
