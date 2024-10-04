const Card = require('../../Card.js');

class NavigatorKetarr extends Card {
    // After Reap: If Navigator Ketarr is on a flank, draw 2 cards and
    // archive a card.
    setupCardAbilities(ability) {
        this.reap({
            condition: (context) => context.source.isOnFlank(),
            gameAction: ability.actions.draw({ amount: 2 }),
            then: {
                alwaysTriggers: true,
                target: {
                    location: 'hand',
                    controller: 'self',
                    gameAction: ability.actions.archive()
                }
            }
        });
    }
}

NavigatorKetarr.id = 'navigator-ketarr';

module.exports = NavigatorKetarr;
