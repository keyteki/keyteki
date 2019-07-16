const Card = require('../../Card.js');

class ShadowSelf extends Card {
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: this,
            effect: ability.effects.cardCannot('dealFightDamage')
        });

        this.interrupt({
            when: {
                onDamageDealt: (event, context) =>
                    context.source.neighbors.includes(event.card) && !event.card.hasTrait('specter') && !event.redirectApplied
            },
            effect: 'redirect the damage',
            gameAction: ability.actions.changeEvent(context => ({
                event: context.event,
                redirectApplied: true,
                card: context.source
            }))
        });
    }
}

ShadowSelf.id = 'shadow-self';

module.exports = ShadowSelf;
