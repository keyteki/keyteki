const Card = require('../../Card.js');

class OverlordGreking extends Card {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardDestroyed: (event, context) =>
                    event.destroyedFighting &&
                    event.card.location === 'discard' &&
                    event.damageEvent.damageSource === context.source
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
