const Card = require('../../Card.js');

class DaemoSaurus extends Card {
    // Play: You may exalt Dmo-Saurus. If you do, deal 3D to a creature.
    // Destroyed: Steal 1A.
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

DaemoSaurus.id = 'dæmo-saurus';

module.exports = DaemoSaurus;
