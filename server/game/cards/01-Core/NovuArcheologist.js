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

NovuArcheologist.id = 'novu-archeologist'; // This is a guess at what the id might be - please check it!!!

module.exports = NovuArcheologist;
