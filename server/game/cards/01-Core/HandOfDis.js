const Card = require('../../Card.js');

class HandOfDis extends Card {
    // Play: Destroy a creature that is not on a flank.
    setupCardAbilities(ability) {
        this.play({
            target: {
                cardType: 'creature',
                cardCondition: (card) => !card.isOnFlank(),
                gameAction: ability.actions.destroy()
            }
        });
    }
}

HandOfDis.id = 'hand-of-dis';

module.exports = HandOfDis;
