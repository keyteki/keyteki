import Card from '../../Card.js';

class CementShoes extends Card {
    // (T) Play: Deal 2D to a creature. If this damage destroys that creature, raise the tide.
    setupCardAbilities(ability) {
        this.play({
            target: {
                cardType: 'creature',
                gameAction: ability.actions.dealDamage({ amount: 2 })
            },
            then: {
                condition: (context) =>
                    context.preThenEvent.destroyEvent &&
                    context.preThenEvent.destroyEvent.destroyedByDamageDealt &&
                    context.preThenEvent.destroyEvent.resolved,
                gameAction: ability.actions.raiseTide(),
                message: '{0} uses {1} to raise the tide'
            }
        });
    }
}

CementShoes.id = 'cement-shoes';

export default CementShoes;
