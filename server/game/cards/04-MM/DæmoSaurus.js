const Card = require('../../Card.js');

class DæmoSaurus extends Card {
    setupCardAbilities(ability) {
        this.play({
            optional: true,
            gameAction: ability.actions.exalt(context => ({
                target: context.source
            })),
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

DæmoSaurus.id = 'dæmo-saurus';

module.exports = DæmoSaurus;
