const Card = require('../../Card.js');

class MasterOf2 extends Card {
    setupCardAbilities(ability) {
        this.reap({
            optional: true,
            target: {
                cardType: 'creature',
                cardCondition: (card) => card.power === 2,
                gameAction: ability.actions.destroy()
            }
        });
    }
}

MasterOf2.id = 'master-of-2';

module.exports = MasterOf2;
