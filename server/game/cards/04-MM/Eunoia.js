const Card = require('../../Card.js');

class Eunoia extends Card {
    // After an enemy creature is destroyed fighting Eunoia, gain 1A and heal 2 damage from Eunoia.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardDestroyed: (event, context) =>
                    event.destroyedFighting && event.damageEvent.damageSource === context.source
            },
            gameAction: [ability.actions.gainAmber(), ability.actions.heal({ amount: 2 })]
        });
    }
}

Eunoia.id = 'eunoia';

module.exports = Eunoia;
