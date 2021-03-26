const Card = require('../../Card.js');

class LightEverlasting extends Card {
    setupCardAbilities(ability) {
        this.play({
            target: {
                controller: 'self',
                cardType: 'creature',
                location: 'discard',
                cardCondition: (card) => card.hasHouse('sanctum'),
                gameAction: ability.actions.playCard({ deploy: true })
            }
        });
    }
}

LightEverlasting.id = 'light-everlasting';

module.exports = LightEverlasting;
