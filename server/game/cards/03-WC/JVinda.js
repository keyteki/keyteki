const Card = require('../../Card.js');

class JVinda extends Card {
    // Elusive. (The first time this creature is attacked each turn, no damage is dealt.)
    // Reap: Deal 1D to a creature. If this damage destroys that creature, steal 1A.
    setupCardAbilities(ability) {
        this.reap({
            target: {
                cardType: 'creature',
                gameAction: ability.actions.dealDamage({ amount: 1 })
            },
            then: {
                condition: (context) =>
                    context.preThenEvent.destroyEvent &&
                    context.preThenEvent.destroyEvent.destroyedByDamageDealt &&
                    context.preThenEvent.destroyEvent.resolved,
                message: '{0} uses {1} to steal 1 amber from {3}',
                messageArgs: (context) => [context.player.opponent],
                gameAction: ability.actions.steal()
            }
        });
    }
}

JVinda.id = 'j-vinda';

module.exports = JVinda;
