const Card = require('../../Card.js');

class TricerianLegionary extends Card {
    setupCardAbilities(ability) {
        this.play({
            target: {
                cardType: 'creature',
                controller: 'self',
                gameAction: ability.actions.ward()
            }
        });
    }
}

TricerianLegionary.id = 'tricerian-legionary'; // This is a guess at what the id might be - please check it!!!

module.exports = TricerianLegionary;
