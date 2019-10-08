const Card = require('../../Card.js');

class Hock extends Card {
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
