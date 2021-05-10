const Card = require('../../Card.js');

class Gravelguts extends Card {
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
