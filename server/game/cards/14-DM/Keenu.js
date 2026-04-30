const Card = require('../../Card.js');

class Keenu extends Card {
    // Play: Choose an enemy creature with no +1 power counters on it.
    // Exhaust that creature and each of its neighbors.
    setupCardAbilities(ability) {
        this.play({
            target: {
                cardType: 'creature',
                controller: 'opponent',
                cardCondition: (card) => !card.powerCounters,
                gameAction: ability.actions.exhaust((context) => ({
                    target: context.target ? [context.target, ...context.target.neighbors] : []
                }))
            }
        });
    }
}

Keenu.id = 'keenu';

module.exports = Keenu;
