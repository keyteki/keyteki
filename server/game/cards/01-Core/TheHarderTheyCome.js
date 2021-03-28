const Card = require('../../Card.js');

class TheHarderTheyCome extends Card {
    setupCardAbilities(ability) {
        this.play({
            target: {
                cardType: 'creature',
                cardCondition: (card) => card.power >= 5,
                gameAction: ability.actions.purge()
            }
        });
    }
}

TheHarderTheyCome.id = 'the-harder-they-come';

module.exports = TheHarderTheyCome;
