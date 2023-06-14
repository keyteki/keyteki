const Card = require('../../Card.js');

class Mugwump extends Card {
    // After an enemy creature is destroyed fighting Mugwump, fully heal Mugwump and give it a +1power counter.
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
