const Card = require('../../Card.js');

class UmbraSaurus extends Card {
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
