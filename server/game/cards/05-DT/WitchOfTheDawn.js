const Card = require('../../Card.js');

class WitchOfTheDawn extends Card {
    // Play: Return a creature from your discard pile to your hand.
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
