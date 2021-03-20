const Card = require('../../Card.js');

class WitchOfTheDawn extends Card {
    setupCardAbilities(ability) {
        this.reap({
            target: {
                location: 'discard',
                cardType: 'creature',
                controller: 'self',
                gameAction: ability.actions.returnToHand({ location: 'discard' })
            }
        });
    }
}

WitchOfTheDawn.id = 'witch-of-the-dawn';

module.exports = WitchOfTheDawn;
