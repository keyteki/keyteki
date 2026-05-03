const Card = require('../../Card.js');

class VanguardWounds extends Card {
    // Play: Deal 3 damage to a creature. If this damage destroys that creature, draw a card.
    setupCardAbilities(ability) {
        this.play({
            target: {
                cardType: 'creature',
                controller: 'any',
                gameAction: ability.actions.dealDamage({ amount: 3 })
            },
            then: {
                condition: (context) =>
                    context.preThenEvent.destroyEvent &&
                    context.preThenEvent.destroyEvent.destroyedByDamageDealt &&
                    context.preThenEvent.destroyEvent.resolved,
                gameAction: ability.actions.draw()
            },
            effect: 'deal 3 damage to {0}'
        });
    }
}

VanguardWounds.id = 'vanguard-wounds';

module.exports = VanguardWounds;
