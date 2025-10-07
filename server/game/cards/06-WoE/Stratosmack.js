import Card from '../../Card.js';

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
                gameAction: ability.actions.makeTokenCreature()
            }
        });
    }
}

Stratosmack.id = 'stratosmack';

export default Stratosmack;
