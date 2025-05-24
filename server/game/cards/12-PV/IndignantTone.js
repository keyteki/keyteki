const Card = require('../../Card.js');

class IndignantTone extends Card {
    // Play: Deal 3D to a creature. If this damage destroys that creature, enrage each of its neighbors after it leaves play.
    setupCardAbilities(ability) {
        this.play({
            target: {
                cardType: 'creature',
                gameAction: ability.actions.dealDamage({ amount: 3 })
            },
            then: {
                condition: (context) =>
                    context.preThenEvent.destroyEvent &&
                    context.preThenEvent.destroyEvent.destroyedByDamageDealt &&
                    context.preThenEvent.destroyEvent.resolved,
                gameAction: ability.actions.enrage((context) => ({
                    target: context.preThenEvent.clone.neighbors
                })),
                message: '{0} uses {1} to enrage {3}',
                messageArgs: (context) => [context.preThenEvent.clone.neighbors]
            }
        });
    }
}

IndignantTone.id = 'indignant-tone';

module.exports = IndignantTone;
