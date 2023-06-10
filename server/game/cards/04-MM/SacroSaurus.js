const Card = require('../../Card.js');

class SacroSaurus extends Card {
    // Play: You may exalt Sacro-Saurus. If you do, deal 3D to a creature.
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

SacroSaurus.id = 'sacro-saurus';

module.exports = SacroSaurus;
