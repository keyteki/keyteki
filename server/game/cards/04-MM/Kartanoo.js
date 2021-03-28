const Card = require('../../Card.js');

class Kartanoo extends Card {
    setupCardAbilities(ability) {
        this.reap({
            target: {
                cardType: 'artifact',
                cardCondition: (card) => card.exhausted === false,
                gameAction: ability.actions.use()
            }
        });
    }
}

Kartanoo.id = 'kartanoo';

module.exports = Kartanoo;
