const Card = require('../../Card.js');

class DinoKnight extends Card {
    // Play: You may exalt Dino-Knight. If you do, deal 3D to a creature.
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

DinoKnight.id = 'dino-knight';

module.exports = DinoKnight;
