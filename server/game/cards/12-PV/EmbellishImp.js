import Card from '../../Card.js';

class EmbellishImp extends Card {
    // Each time an enemy creature is destroyed, steal 1.
    // Fate: Destroy the most powerful friendly creature.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardDestroyed: (event, context) =>
                    event.card.type === 'creature' &&
                    event.card.controller === context.player.opponent
            },
            gameAction: ability.actions.steal()
        });

        this.fate({
            target: {
                mode: 'mostStat',
                cardType: 'creature',
                controller: 'opponent',
                numCards: 1,
                cardStat: (card) => card.power,
                gameAction: ability.actions.destroy()
            }
        });
    }
}

EmbellishImp.id = 'embellish-imp';

export default EmbellishImp;
