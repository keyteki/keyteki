const Card = require('../../Card.js');

class ZealotsRevelation extends Card {
    // Enhance
    // Play: Draw 4 cards.
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.draw({ amount: 4 })
        });
    }
}

ZealotsRevelation.id = 'zealot-s-revelation';

module.exports = ZealotsRevelation;
