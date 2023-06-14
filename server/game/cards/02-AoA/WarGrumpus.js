const Card = require('../../Card.js');

class WarGrumpus extends Card {
    // Fight/Reap: Ready and fight with a neighboring Giant.
    setupCardAbilities(ability) {
        this.fight({
            reap: true,
            target: {
                cardType: 'creature',
                controller: 'self',
                cardCondition: (card, context) =>
                    context.source.neighbors.includes(card) && card.hasTrait('giant'),
                gameAction: ability.actions.sequential([
                    ability.actions.ready(),
                    ability.actions.fight()
                ])
            },
            effect: 'ready and fight with a neighboring giant'
        });
    }
}

WarGrumpus.id = 'war-grumpus';

module.exports = WarGrumpus;
