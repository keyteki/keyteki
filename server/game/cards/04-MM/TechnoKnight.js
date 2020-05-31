const Card = require('../../Card.js');

class TechnoKnight extends Card {
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

TechnoKnight.id = 'techno-knight';

module.exports = TechnoKnight;
