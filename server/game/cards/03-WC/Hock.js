const Card = require('../../Card.js');

class Hock extends Card {
    // Play: Destroy an artifact. If you do, gain 1A.
    setupCardAbilities(ability) {
        this.play({
            target: {
                cardType: 'artifact',
                gameAction: ability.actions.destroy()
            },
            then: {
                gameAction: ability.actions.gainAmber({ amount: 1 })
            }
        });
    }
}

Hock.id = 'hock';

module.exports = Hock;
