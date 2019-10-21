const Card = require('../../Card.js');

class WitchOfTheEye extends Card {
    setupCardAbilities(ability) {
        this.reap({
            target: {
                location: 'discard',
                controller: 'self',
                gameAction: ability.actions.returnToHand({ location: 'discard' })
            }
        });
    }
}

WitchOfTheEye.id = 'witch-of-the-eye';

module.exports = WitchOfTheEye;
