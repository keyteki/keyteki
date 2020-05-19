const Card = require('../../Card.js');

class Ogopogo extends Card {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onDamageDealt: (event, context) =>
                    event.fightEvent &&
                    event.fightEvent.attacker === context.source &&
                    event.destroyEvent &&
                    event.destroyEvent.resolved
            },
            optional: true,
            target: {
                cardType: 'creature',
                gameAction: ability.actions.dealDamage({ amount: 2 })
            }
        });
    }
}

Ogopogo.id = 'ogopogo';

module.exports = Ogopogo;
