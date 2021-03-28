const Card = require('../../Card.js');

class Oubliette extends Card {
    setupCardAbilities(ability) {
        this.play({
            target: {
                cardType: 'creature',
                cardCondition: (card) => card.power <= 3,
                gameAction: ability.actions.purge()
            }
        });
    }
}

Oubliette.id = 'oubliette';

module.exports = Oubliette;
