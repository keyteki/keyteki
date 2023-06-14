const Card = require('../../Card.js');

class Gravelguts extends Card {
    // After an enemy creature is destroyed fighting Gravelguts, give Gravelguts two +1 power counters.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardDestroyed: (event, context) =>
                    event.destroyedFighting && event.damageEvent.damageSource === context.source
            },
            gameAction: ability.actions.addPowerCounter({
                amount: 2
            })
        });
    }
}

Gravelguts.id = 'gravelguts';

module.exports = Gravelguts;
