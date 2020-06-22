const Card = require('../../Card.js');

class Eunoia extends Card {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onDamageDealt: (event, context) =>
                    event.damageSource === context.source &&
                    event.destroyEvent &&
                    event.destroyEvent.resolved
            },
            gameAction: [ability.actions.gainAmber(), ability.actions.heal({ amount: 2 })]
        });
    }
}

Eunoia.id = 'eunoia';

module.exports = Eunoia;
