const Card = require('../../Card.js');

class Hystricog extends Card {
    // Enhance DDD. (These icons have already been added to cards in your deck.)
    // Action: Destroy a damaged creature.
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
