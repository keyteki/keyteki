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

WitchOfTheEye.id = 'witch-of-the-eye'; // This is a guess at what the id might be - please check it!!!

module.exports = WitchOfTheEye;
