const Card = require('../../Card.js');

class IntentionalDischarge extends Card {
    // Play: Return a friendly creature to its owner's hand. If you do, ready a friendly Mars creature.
    setupCardAbilities(ability) {
        this.play({
            target: {
                controller: 'self',
                cardType: 'creature',
                gameAction: ability.actions.returnToHand()
            },
            then: {
                target: {
                    controller: 'self',
                    cardType: 'creature',
                    cardCondition: (card) => card.hasHouse('mars'),
                    gameAction: ability.actions.ready()
                }
            }
        });
    }
}

IntentionalDischarge.id = 'intentional-discharge';

module.exports = IntentionalDischarge;
