import Card from '../../Card.js';

class DeepPriestGlebe extends Card {
    // After you play an Aquan creature, exhaust an enemy creature.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardEntersPlay: (event, context) =>
                    event.card.type === 'creature' &&
                    event.card.hasTrait('aquan') &&
                    event.context.player === context.player
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

export default DeepPriestGlebe;
