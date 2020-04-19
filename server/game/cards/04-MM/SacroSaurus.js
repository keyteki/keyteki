const Card = require('../../Card.js');

class SacroSaurus extends Card {
    setupCardAbilities(ability) {
        this.fight({
            target: {
                optional: true,
                cardType: 'creature',
                cardCondition: (card, context) => card === context.source,
                gameAction: ability.actions.exalt()
            },
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
