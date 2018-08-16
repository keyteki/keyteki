const Card = require('../../Card.js');

class Oubliette extends Card {
    setupCardAbilities(ability) {
        this.play({
            target: {
                cardType: 'creature',
                cardCondition: card => card.power <= 3,
                gameAction: ability.actions.purge()
            }
        });
    }
}

Oubliette.id = 'oubliette'; // This is a guess at what the id might be - please check it!!!

module.exports = Oubliette;
