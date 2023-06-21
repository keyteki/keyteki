const Card = require('../../Card.js');

class NovuArcheologist extends Card {
    // Action: Archive a card from your discard pile.
    setupCardAbilities(ability) {
        this.action({
            target: {
                controller: 'self',
                location: 'discard',
                gameAction: ability.actions.archive()
            }
        });
    }
}

NovuArcheologist.id = 'novu-archaeologist';

module.exports = NovuArcheologist;
