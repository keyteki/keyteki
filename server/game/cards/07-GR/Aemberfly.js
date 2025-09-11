const Card = require('../../Card.js');

class Aemberfly extends Card {
    // After Fight: Capture 1.
    //
    // After Reap: Move 1 from Æmberfly to your pool
    setupCardAbilities(ability) {
        this.fight({
            gameAction: ability.actions.capture()
        });

        this.reap({
            gameAction: ability.actions.removeAmber(),
            then: {
                gameAction: ability.actions.gainAmber()
            }
        });
    }
}

Aemberfly.id = 'æmberfly';

module.exports = Aemberfly;
