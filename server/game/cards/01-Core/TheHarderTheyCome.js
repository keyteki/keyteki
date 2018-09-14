const Card = require('../../Card.js');

class TheHarderTheyCome extends Card {
    setupCardAbilities(ability) {
        this.play({
            target: {
                cardType: 'creature',
                cardCondtion: card => card.power >= 5,
                gameAction: ability.actions.purge()
            }
        });
    }
}

TheHarderTheyCome.id = 'the-harder-they-come'; // This is a guess at what the id might be - please check it!!!

module.exports = TheHarderTheyCome;
