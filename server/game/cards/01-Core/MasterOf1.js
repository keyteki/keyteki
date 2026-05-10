const Card = require('../../Card.js');

class MasterOf1 extends Card {
    // Reap: You may destroy a creature with 1 power.
    setupCardAbilities(ability) {
        this.reap({
            target: {
                optional: true,
                cardType: 'creature',
                cardCondition: (card) => card.power === 1,
                gameAction: ability.actions.destroy()
            }
        });
    }
}

MasterOf1.id = 'master-of-1';

module.exports = MasterOf1;
