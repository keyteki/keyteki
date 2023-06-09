const Card = require('../../Card.js');

class BewareTheIdes extends Card {
    // Play: Deal 23D to a creature in the center of its controllers battleline.
    setupCardAbilities(ability) {
        this.play({
            target: {
                cardType: 'creature',
                cardCondition: (card) => card.isInCenter(),
                gameAction: ability.actions.dealDamage({ amount: 23 })
            }
        });
    }
}

BewareTheIdes.id = 'beware-the-ides';

module.exports = BewareTheIdes;
