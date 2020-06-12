const Card = require('../../Card.js');

class TechnoThief extends Card {
    setupCardAbilities(ability) {
        this.reap({
            target: {
                controller: 'self',
                location: 'hand',
                gameAction: ability.actions.discard()
            },
            then: {
                gameAction: ability.actions.draw()
            }
        });
    }
}

TechnoThief.id = 'techno-thief';

module.exports = TechnoThief;
