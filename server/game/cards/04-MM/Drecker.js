const Card = require('../../Card.js');

class Drecker extends Card {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onDamageDealt: (event, context) =>
                    event.fightEvent && context.source.neighbors.includes(event.card)
            },
            effect: 'duplicate the damage dealt to {1}',
            effectArgs: (context) => context.event.card,
            gameAction: ability.actions.dealDamage((context) => ({
                amount: context.event.amount,
                damageSource: context.event.damageSource,
                ignoreArmor: context.event.ignoreArmor,
                fightEvent: context.event.fightEvent
            }))
        });

        this.reap({
            gameAction: ability.actions.steal()
        });
    }
}

Drecker.id = 'drecker';

module.exports = Drecker;
