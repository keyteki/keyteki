const Card = require('../../Card.js');

class MasterOf3 extends Card {
    // Reap: You may destroy a creature with 3 power.
    setupCardAbilities(ability) {
        this.reap({
            optional: true,
            target: {
                cardType: 'creature',
                cardCondition: (card) => card.power === 3,
                gameAction: ability.actions.destroy()
            }
        });
    }
}

MasterOf3.id = 'master-of-3';

module.exports = MasterOf3;
