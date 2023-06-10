const Card = require('../../Card.js');

class NizakTheForgotten extends Card {
    // While fighting, Nizak, The Forgotten gains invulnerable. (It cannot be destroyed or dealt damage.)
    // After an enemy creature is destroyed fighting Nizak, The Forgotten, return that creature to its owners hand.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardDestroyed: (event, context) =>
                    event.destroyedFighting &&
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
