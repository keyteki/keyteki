const Card = require('../../Card.js');

class Krump extends Card {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onDamageDealt: (event, context) =>
                    event.damageSource === context.source &&
                    event.destroyEvent &&
                    event.destroyEvent.resolved
            },
            gameAction: ability.actions.loseAmber()
        });
    }
}

Krump.id = 'krump';

module.exports = Krump;
