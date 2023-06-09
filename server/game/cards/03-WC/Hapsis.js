const Card = require('../../Card.js');

class Hapsis extends Card {
    // After an enemy creature is destroyed fighting Hapsis, ward Hapsis and draw a card.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardDestroyed: (event, context) =>
                    event.destroyedFighting && event.damageEvent.damageSource === context.source
            },
            gameAction: [ability.actions.ward(), ability.actions.draw()]
        });
    }
}

Hapsis.id = 'hapsis';

module.exports = Hapsis;
