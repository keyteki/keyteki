const Card = require('../../Card.js');

class Imperium extends Card {
    setupCardAbilities(ability) {
        this.play({
            target: {
                cardType: 'creature',
                controller: 'self',
                mode: 'exactly',
                numCards: 2,
                gameAction: ability.actions.ward()
            }
        });
    }
}

Imperium.id = 'imperium';

module.exports = Imperium;
