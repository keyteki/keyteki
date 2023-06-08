const Card = require('../../Card.js');

class DinoBeast extends Card {
    // Skirmish. (When you use this creature to fight, it is dealt no damage in return.)
    // Play: You may exalt Dino-Beast. If you do, deal 3D to a creature.
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

DinoBeast.id = 'dino-beast';

module.exports = DinoBeast;
