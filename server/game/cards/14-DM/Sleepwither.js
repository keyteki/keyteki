const Card = require('../../Card.js');

class Sleepwither extends Card {
    // Enhance ouboros ouboros.
    // Play: Destroy an Ouboros creature. If you do, gain 2A.
    setupCardAbilities(ability) {
        this.play({
            target: {
                cardType: 'creature',
                controller: 'any',
                cardCondition: (card) => card.hasHouse('ouboros'),
                gameAction: ability.actions.destroy()
            },
            then: {
                gameAction: ability.actions.gainAmber({ amount: 2 })
            },
            effect: 'destroy {0} and gain 2 amber'
        });
    }
}

Sleepwither.id = 'sleepwither';

module.exports = Sleepwither;
