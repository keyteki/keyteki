const Card = require('../../Card.js');

class NizakTheForgotten extends Card {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onDamageDealt: (event, context) => event.damageSource === context.source && event.destroyed && event.card.location === 'discard'
            },
            gameAction: ability.actions.returnToHand(context => ({
                location: 'discard',
                target: context.event.card
            }))
        });

        this.persistentEffect({
            condition: context => context.source.isFighting,
            effect: ability.effects.addKeyword({ invulnerable: 1 })
        });
    }
}

NizakTheForgotten.id = 'nizak-the-forgotten';

module.exports = NizakTheForgotten;
