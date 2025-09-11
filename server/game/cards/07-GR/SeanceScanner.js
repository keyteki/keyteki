const Card = require('../../Card.js');

class SeanceScanner extends Card {
    // Action: If you are haunted, use a friendly non-Star Alliance creature.
    setupCardAbilities(ability) {
        this.action({
            condition: (context) => context.source.controller.isHaunted(),
            target: {
                cardType: 'creature',
                controller: 'self',
                cardCondition: (card) => !card.exhausted && !card.hasHouse('staralliance'),
                gameAction: ability.actions.use()
            }
        });
    }
}

SeanceScanner.id = 'séance-scanner';

module.exports = SeanceScanner;
