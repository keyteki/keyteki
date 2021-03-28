const Card = require('../../Card.js');

class TechnoBeast extends Card {
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

TechnoBeast.id = 'techno-beast';

module.exports = TechnoBeast;
