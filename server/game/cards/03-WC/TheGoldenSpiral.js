const Card = require('../../Card.js');

class TheGoldenSpiral extends Card {
    // Action: Exalt a friendly creature. Ready and use that creature.
    setupCardAbilities(ability) {
        this.action({
            target: {
                cardType: 'creature',
                controller: 'self',
                gameAction: ability.actions.sequential([
                    ability.actions.exalt(),
                    ability.actions.ready(),
                    ability.actions.use()
                ])
            },
            effect: 'exalt, ready and use {0}'
        });
    }
}

TheGoldenSpiral.id = 'the-golden-spiral';

module.exports = TheGoldenSpiral;
