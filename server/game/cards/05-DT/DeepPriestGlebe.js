const Card = require('../../Card.js');

class DeepPriestGlebe extends Card {
    // After you play an Aquan creature, exhaust an enemy creature.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardPlayed: (event, context) =>
                    event.card.type === 'creature' &&
                    event.card.hasTrait('aquan') &&
                    event.player === context.player
            },
            target: {
                cardType: 'creature',
                controller: 'opponent',
                gameAction: ability.actions.exhaust()
            }
        });
    }
}

DeepPriestGlebe.id = 'deep-priest-glebe';

module.exports = DeepPriestGlebe;
