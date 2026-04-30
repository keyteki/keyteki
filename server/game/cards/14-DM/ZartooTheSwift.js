const Card = require('../../Card.js');

class ZartooTheSwift extends Card {
    // After Reap: Ready and use a friendly non-Dragon creature.
    setupCardAbilities(ability) {
        this.reap({
            target: {
                cardType: 'creature',
                controller: 'self',
                cardCondition: (card) => !card.hasTrait('dragon'),
                gameAction: ability.actions.sequential([
                    ability.actions.ready(),
                    ability.actions.use()
                ])
            },
            effect: 'ready and use {1}'
        });
    }
}

ZartooTheSwift.id = 'zartoo-the-swift';

module.exports = ZartooTheSwift;
