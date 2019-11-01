const Card = require('../../Card.js');

class HandOfDis extends Card {
    setupCardAbilities(ability) {
        this.play({
            target: {
                cardType: 'creature',
                cardCondition: card => !card.isOnFlank(),
                gameAction: ability.actions.destroy()
            }
        });
    }
}

HandOfDis.id = 'hand-of-dis';

module.exports = HandOfDis;
