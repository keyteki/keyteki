const Card = require('../../Card.js');

class Yurk extends Card {
    setupCardAbilities(ability) {
        this.play({
            target: {
                controller: 'self',
                location: 'hand',
                gameAction: ability.actions.discard()
            }
        });
    }
}

Yurk.id = 'yurk';

module.exports = Yurk;
