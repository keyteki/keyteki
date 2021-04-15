const Card = require('../../Card.js');

class FrigorificRod extends Card {
    // Action: Exhaust a creature or artifact.
    setupCardAbilities(ability) {
        this.action({
            target: {
                cardCondition: (card) => card.type === 'creature' || card.type === 'artifact',
                gameAction: ability.actions.exhaust()
            }
        });
    }
}

FrigorificRod.id = 'frigorific-rod';

module.exports = FrigorificRod;
