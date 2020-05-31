const Card = require('../../Card.js');

class BewareTheIdes extends Card {
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
