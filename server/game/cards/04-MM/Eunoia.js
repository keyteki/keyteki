const Card = require('../../Card.js');

class Eunoia extends Card {
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
