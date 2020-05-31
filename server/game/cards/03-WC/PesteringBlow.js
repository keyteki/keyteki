const Card = require('../../Card.js');

class PesteringBlow extends Card {
    setupCardAbilities(ability) {
        this.play({
            target: {
                cardType: 'creature',
                gameAction: [ability.actions.dealDamage({ amount: 1 }), ability.actions.enrage()]
            },
            effect: 'deal 1 damage and enrage {0}'
        });
    }
}

PesteringBlow.id = 'pestering-blow';

module.exports = PesteringBlow;
