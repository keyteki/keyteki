const Card = require('../../Card.js');

class Apoptosis extends Card {
    // Play: Purge a card from your discard pile. If you do, a friendly
    // creature captures 2.
    setupCardAbilities(ability) {
        this.play({
            target: {
                location: 'discard',
                controller: 'self',
                gameAction: ability.actions.purge()
            },
            then: {
                target: {
                    cardType: 'creature',
                    controller: 'self',
                    gameAction: ability.actions.capture({ amount: 2 })
                }
            }
        });
    }
}

Apoptosis.id = 'apoptosis';

module.exports = Apoptosis;
