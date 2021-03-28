const Card = require('../../Card.js');

class Francus extends Card {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onDamageDealt: (event, context) =>
                    event.damageSource === context.source &&
                    event.destroyEvent &&
                    event.destroyEvent.resolved
            },
            gameAction: ability.actions.capture()
        });
    }
}

Francus.id = 'francus';

module.exports = Francus;
