const Card = require('../../Card.js');

class Snudge extends Card {
    setupCardAbilities(ability) {
        this.fight({
            reap: true,
            target: {
                cardCondition: card => card.type === 'artifact' || card.isOnFlank(),
                gameAction: ability.actions.returnToHand()
            }
        });
    }
}

Snudge.id = 'snudge'; // This is a guess at what the id might be - please check it!!!

module.exports = Snudge;
