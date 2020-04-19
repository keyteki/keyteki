const Card = require('../../Card.js');

class LycoSaurus extends Card {
    setupCardAbilities(ability) {
        this.play({
            optional: true,
            gameAction: ability.actions.exalt(),
            then: {
                target: {
                    cardType: 'creature',
                    gameAction: ability.actions.dealDamage({ amount: 3 })
                }
            }
        });
    }
}

LycoSaurus.id = 'lyco-saurus';

module.exports = LycoSaurus;
