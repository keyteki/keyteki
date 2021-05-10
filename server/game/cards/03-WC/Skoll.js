const Card = require('../../Card.js');

class Skoll extends Card {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardDestroyed: (event, context) =>
                    event.damageEvent &&
                    event.damageEvent.damageType === 'assault' &&
                    event.damageEvent.damageSource === context.source
            },
            target: {
                cardType: 'creature',
                controller: 'self',
                message: '{0} uses {1} to place +1 on {2}',
                messageArgs: (context) => {
                    return [context.player, context.source, context.target];
                },
                gameAction: ability.actions.addPowerCounter()
            }
        });
    }
}

Skoll.id = 'sköll';

module.exports = Skoll;
