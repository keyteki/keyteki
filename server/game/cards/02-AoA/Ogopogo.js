const Card = require('../../Card.js');

class Ogopogo extends Card {
    // After Ogopogo attacks and destroys a creature, you may deal 2D to a creature.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardDestroyed: (event, context) =>
                    event.destroyedFighting &&
                    event.damageEvent.fightEvent.attacker === context.source
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
