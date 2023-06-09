const Card = require('../../Card.js');

class PainReaction extends Card {
    // Play: Deal 2D to an enemy creature. If this damage destroys that creature, deal 2D to each of that creatures neighbors.
    setupCardAbilities(ability) {
        this.play({
            target: {
                cardType: 'creature',
                controller: 'opponent',
                gameAction: ability.actions.dealDamage({ amount: 2 })
            },
            then: {
                condition: (context) =>
                    context.preThenEvent.destroyEvent &&
                    context.preThenEvent.destroyEvent.destroyedByDamageDealt &&
                    context.preThenEvent.destroyEvent.resolved,
                gameAction: ability.actions.dealDamage((context) => ({
                    amount: 2,
                    target: context.preThenEvent.clone.neighbors
                })),
                message: '{0} uses {1} to deal extra 2 damage to {3}',
                messageArgs: (context) => [context.preThenEvent.clone.neighbors]
            }
        });
    }
}

PainReaction.id = 'pain-reaction';

module.exports = PainReaction;
