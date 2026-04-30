const Card = require('../../Card.js');

class Sleepwither extends Card {
    // Enhance. Play: Destroy an Ouboros creature. If you do, gain 2.
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
            effect: 'destroy {1}'
        });
    }
}

Sleepwither.id = 'sleepwither';

module.exports = Sleepwither;
