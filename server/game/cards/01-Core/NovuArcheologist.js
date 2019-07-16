const Card = require('../../Card.js');

class NovuArcheologist extends Card {
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
