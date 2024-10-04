const Card = require('../../Card.js');

class PropDusting extends Card {
    // Play: Destroy an enemy flank creature.
    setupCardAbilities(ability) {
        this.play({
            target: {
                cardType: 'creature',
                controller: 'opponent',
                cardCondition: (card) => card.isOnFlank(),
                gameAction: ability.actions.destroy()
            }
        });
    }
}

PropDusting.id = 'prop-dusting';

module.exports = PropDusting;
