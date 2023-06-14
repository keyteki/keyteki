const Card = require('../../Card.js');

class TheHarderTheyCome extends Card {
    // Play: Purge a creature with power 5or higher.
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
