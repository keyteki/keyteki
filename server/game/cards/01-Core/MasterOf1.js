const Card = require('../../Card.js');

class MasterOf1 extends Card {
    setupCardAbilities(ability) {
        this.reap({
            optional: true,
            target: {
                cardType: 'creature',
                cardCondition: (card) => card.power === 1,
                gameAction: ability.actions.destroy()
            }
        });
    }
}

MasterOf1.id = 'master-of-1';

module.exports = MasterOf1;
