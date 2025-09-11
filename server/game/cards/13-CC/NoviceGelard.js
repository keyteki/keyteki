const Card = require('../../Card.js');

class NoviceGelard extends Card {
    // Play: Ready and reap with a neighboring Sanctum creature.
    setupCardAbilities(ability) {
        this.play({
            target: {
                cardType: 'creature',
                controller: 'self',
                cardCondition: (card, context) =>
                    context.source.neighbors.includes(card) && card.hasHouse('sanctum'),
                gameAction: ability.actions.sequential([
                    ability.actions.ready(),
                    ability.actions.reap()
                ])
            },
            effect: 'ready and reap with a neighboring Sanctum creature'
        });
    }
}

NoviceGelard.id = 'novice-gelard';

module.exports = NoviceGelard;
