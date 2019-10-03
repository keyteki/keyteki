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

Imperium.id = 'imperium'; // This is a guess at what the id might be - please check it!!!

module.exports = Imperium;
