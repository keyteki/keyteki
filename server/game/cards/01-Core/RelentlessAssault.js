const Card = require('../../Card.js');

class RelentlessAssault extends Card {
    setupCardAbilities(ability) {
        this.play({
            target: {
                cardType: 'creature',
                controller: 'self',
                mode: 'upTo',
                numCards: 3,
                gameAction: ability.actions.sequentialForEach(context => ({
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

RelentlessAssault.id = 'relentless-assault'; // This is a guess at what the id might be - please check it!!!

module.exports = RelentlessAssault;
