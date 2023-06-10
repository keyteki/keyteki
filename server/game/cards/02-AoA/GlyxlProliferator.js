const Card = require('../../Card.js');

class GlyxlProliferator extends Card {
    // Reap: If Glyxl Proliferator is on a flank, archive a Mars card from your discard pile.
    setupCardAbilities(ability) {
        this.reap({
            condition: (context) => context.source.isOnFlank(),
            target: {
                controller: 'self',
                cardCondition: (card) => card.hasHouse('mars'),
                location: 'discard',
                gameAction: ability.actions.archive()
            }
        });
    }
}

GlyxlProliferator.id = 'glyxl-proliferator';

module.exports = GlyxlProliferator;
