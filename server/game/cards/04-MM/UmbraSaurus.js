const Card = require('../../Card.js');

class UmbraSaurus extends Card {
    // Elusive. (The first time this creature is attacked each turn, no damage is dealt.)
    // Play: You may exalt Umbra-Saurus. If you do, deal 3D to a creature.
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

UmbraSaurus.id = 'umbra-saurus';

module.exports = UmbraSaurus;
