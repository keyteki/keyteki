const Card = require('../../Card.js');

class Amberologist extends Card {
    // Action: Capture 1A.
    setupCardAbilities(ability) {
        this.action({
            gameAction: ability.actions.capture()
        });
    }
}

Amberologist.id = 'æmberologist';

module.exports = Amberologist;
