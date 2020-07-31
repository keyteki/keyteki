const Card = require('../../Card.js');

class Drecker extends Card {
    setupCardAbilities(ability) {
        this.interrupt({
            when: {
                onDamageDealt: (event, context) =>
                    event.fightEvent && context.source.neighbors.includes(event.card)
            },
            effect: 'duplicate the damage dealt to {1}',
            effectArgs: (context) => context.event.card,
            gameAction: ability.actions.addEventToWindow((context) => ({
                targetEvent: context.event,
                eventToAdd: ability.actions
                    .dealDamage({
                        amount: context.event.amount,
                        damageSource: context.event.damageSource,
                        ignoreArmor: context.event.ignoreArmor
                    }).getEvent(context.source, context.event.context)
            }))
        });

        this.reap({
            gameAction: ability.actions.steal()
        });
    }
}

Drecker.id = 'drecker';

module.exports = Drecker;
