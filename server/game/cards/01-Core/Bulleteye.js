const Card = require('../../Card.js');

class Bulleteye extends Card {
    // Elusive. (The first time this creature is attacked each turn, no damage is dealt.)
    // Reap: Destroy a flank creature.
    setupCardAbilities(ability) {
        this.reap({
            target: {
                cardType: 'creature',
                cardCondition: (card) => card.isOnFlank(),
                gameAction: ability.actions.destroy()
            }
        });
    }
}

Bulleteye.id = 'bulleteye';

module.exports = Bulleteye;
