const Card = require('../../Card.js');

class RelentlessAssault extends Card {
    // Play: Ready and fight with up
    // to 3different friendly creatures,
    // one at a time.
    setupCardAbilities(ability) {
        this.play({
            target: {
                cardType: 'creature',
                controller: 'self',
                mode: 'upTo',
                numCards: 3,
                gameAction: ability.actions.sequentialForEach((context) => ({
                    forEach: context.target,
                    action: ability.actions.sequential([
                        ability.actions.ready(),
                        ability.actions.fight()
                    ])
                }))
            },
            effect: 'ready and fight with {0}'
        });
    }
}

RelentlessAssault.id = 'relentless-assault';

module.exports = RelentlessAssault;
