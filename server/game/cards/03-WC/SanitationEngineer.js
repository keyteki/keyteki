const Card = require('../../Card.js');

class SanitationEngineer extends Card {
    setupCardAbilities(ability) {
        this.reap({
            target: {
                controller: 'self',
                location: 'hand',
                gameAction: ability.actions.discard()
            }
        });
    }
}

SanitationEngineer.id = 'sanitation-engineer';

module.exports = SanitationEngineer;
