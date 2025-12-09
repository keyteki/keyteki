const Card = require('../../Card.js');

class Stratosmack extends Card {
    // Play: Deal 3 Damage to a creature. If this damage destroys that
    // creature, make a token creature.
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
                gameAction: ability.actions.makeTokenCreature(),
                message: '{0} uses {1} to make a token creature',
                messageArgs: (preContext) => [preContext.player, preContext.source]
            }
        });
    }
}

Stratosmack.id = 'stratosmack';

module.exports = Stratosmack;
