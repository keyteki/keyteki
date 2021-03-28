const Card = require('../../Card.js');

class Skoll extends Card {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onDamageDealt: (event, context) =>
                    event.damageSource === context.source &&
                    event.damageType === 'assault' &&
                    event.destroyEvent &&
                    event.destroyEvent.resolved
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
