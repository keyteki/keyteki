const Card = require('../../Card.js');

class Hystricog extends Card {
    setupCardAbilities(ability) {
        this.action({
            target: {
                cardType: 'creature',
                cardCondition: (card) => card.hasToken('damage'),
                gameAction: ability.actions.destroy()
            }
        });
    }
}

Hystricog.id = 'hystricog';

module.exports = Hystricog;
