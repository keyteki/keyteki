const Card = require('../../Card.js');

class NizakTheForgotten extends Card {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardDestroyed: (event, context) =>
                    event.damageEvent &&
                    event.damageEvent.fightEvent &&
                    event.damageEvent.damageSource === context.source &&
                    event.card.location === 'discard'
            },
            gameAction: ability.actions.returnToHand((context) => ({
                location: 'discard',
                target: context.event.card
            }))
        });

        this.persistentEffect({
            condition: (context) => context.source.isFighting,
            effect: ability.effects.addKeyword({ invulnerable: 1 })
        });
    }
}

NizakTheForgotten.id = 'nizak-the-forgotten';

module.exports = NizakTheForgotten;
