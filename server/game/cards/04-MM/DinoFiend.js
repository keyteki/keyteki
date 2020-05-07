const Card = require('../../Card.js');

class DinoFiend extends Card {
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

        this.destroyed({
            gameAction: ability.actions.steal({ amount: 1 })
        });
    }
}

DinoFiend.id = 'dino-fiend';

module.exports = DinoFiend;
