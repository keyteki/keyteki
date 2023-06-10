const Card = require('../../Card.js');

class ShadowSelf extends Card {
    // Shadow Self deals no damage when fighting.
    // Damage dealt to non-Specter neighbors is dealt to Shadow Self instead.
    setupCardAbilities(ability) {
        this.persistentEffect({
            effect: ability.effects.cardCannot('dealFightDamage')
        });

        this.interrupt({
            when: {
                onDamageApplied: (event, context) =>
                    context.source.neighbors.includes(event.card) &&
                    !event.card.hasTrait('specter') &&
                    event.amount > 0
            },
            effect: 'redirect the damage',
            gameAction: ability.actions.changeEvent((context) => ({
                event: context.event,
                card: context.source
            }))
        });
    }
}

ShadowSelf.id = 'shadow-self';

module.exports = ShadowSelf;
