const Card = require('../../Card.js');

class Snudge extends Card {
    // Fight/Reap: Return an artifact or flank creature to its owners hand.
    setupCardAbilities(ability) {
        this.fight({
            reap: true,
            target: {
                cardCondition: (card) => card.type === 'artifact' || card.isOnFlank(),
                gameAction: ability.actions.returnToHand()
            }
        });
    }
}

Snudge.id = 'snudge';

module.exports = Snudge;
