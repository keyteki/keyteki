const Card = require('../../Card.js');

class Drecker extends Card {
    // Damage dealt to Dreckers neighbors during fights is also dealt to Drecker.
    // Reap: Steal 1A.
    setupCardAbilities(ability) {
        this.interrupt({
            when: {
                onDamageApplied: (event, context) =>
                    event.fightEvent && context.source.neighbors.includes(event.card)
            },
            effect: 'duplicate the damage dealt to {1}',
            effectArgs: (context) => context.event.card,
            gameAction: ability.actions.addEventToWindow((context) => ({
                targetEvent: context.event,
                eventToAdd: ability.actions
                    .applyDamage({
                        amount: context.event.amount,
                        damageSource: context.event.damageSource
                    })
                    .getEvent(context.source, context.event.context)
            }))
        });

        this.reap({
            gameAction: ability.actions.steal()
        });
    }
}

Drecker.id = 'drecker';

module.exports = Drecker;
