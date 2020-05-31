const Card = require('../../Card.js');

class OverlordGreking extends Card {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onDamageDealt: (event, context) =>
                    event.damageSource === context.source &&
                    event.card.location === 'discard' &&
                    event.destroyEvent &&
                    event.destroyEvent.resolved
            },
            gameAction: ability.actions.putIntoPlay((context) => ({
                target: context.event.card,
                myControl: true
            }))
        });
    }
}

OverlordGreking.id = 'overlord-greking';

module.exports = OverlordGreking;
