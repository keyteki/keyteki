const Card = require('../../Card.js');

class ShoulderId extends Card {
    setupCardAbilities(ability) {
        this.persistentEffect({
            effect: ability.effects.cardCannot('fight')
        });

        this.interrupt({
            when: {
                onDamageDealt: (event, context) => context.source === event.damageSource
            },
            effect: 'steal 1 amber',
            gameAction: [
                ability.actions.changeEvent((context) => ({
                    event: context.event,
                    cancel: true
                })),
                ability.actions.steal((context) => ({
                    target: context.event.damageSource.controller.opponent
                }))
            ]
        });
    }
}

ShoulderId.id = 'shoulder-id';

module.exports = ShoulderId;
