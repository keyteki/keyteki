const Card = require('../../Card.js');

class Floomf extends Card {
    setupCardAbilities(ability) {
        this.fight({
            target: {
                cardType: 'creature',
                cardCondition: (card) => card.traits.includes('beast'),
                gameAction: ability.actions.addPowerCounter({
                    amount: 2
                })
            }
        });
    }
}

Floomf.id = 'floomf';

module.exports = Floomf;
