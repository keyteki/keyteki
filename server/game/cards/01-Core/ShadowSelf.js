const Card = require('../../Card.js');

class ShadowSelf extends Card {
    setupCardAbilities(ability) {
        this.persistentEffect({
            effect: ability.effects.cardCannot('dealFightDamage')
        });

        this.interrupt({
            when: {
                onDamageDealt: (event, context) =>
                    context.source.neighbors.includes(event.card) &&
                    !event.card.hasTrait('specter') &&
                    event.amount > ((!event.ignoreArmor && event.card.tokens.armor) || 0)
            },
            effect: 'redirect the damage',
            gameAction: [
                ability.actions.changeEvent((context) => ({
                    event: context.event,
                    cancel: context.event.ignoreArmor || !context.event.card.tokens.armor,
                    amount: context.event.card.tokens.armor || 0
                })),
                ability.actions.addEventToWindow((context) => ({
                    targetEvent: context.event,
                    eventToAdd: ability.actions
                        .dealDamage({
                            amount:
                                context.event.amount -
                                ((!context.event.ignoreArmor && context.event.card.tokens.armor) ||
                                    0),
                            damageSource: context.event.damageSource,
                            ignoreArmor: context.event.ignoreArmor
                        })
                        .getEvent(context.source, context.event.context)
                }))
            ]
        });
    }
}

ShadowSelf.id = 'shadow-self';

module.exports = ShadowSelf;
