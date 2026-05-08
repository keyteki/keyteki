const Card = require('../../Card.js');

class AllAreMars extends Card {
    // Action: Ready and use a friendly creature.
    setupCardAbilities(ability) {
        this.action({
            target: {
                cardType: 'creature',
                controller: 'self',
                gameAction: ability.actions.sequential([
                    ability.actions.ready(),
                    ability.actions.use()
                ])
            },
            effect: 'ready and use {0}'
        });
    }
}

AllAreMars.id = 'all-are-mars';

module.exports = AllAreMars;
