import Card from '../../Card.js';

class AusteralisSeaborg extends Card {
    // (T) Reap: Deal 2D to a creature. If this damage destroys that creature, raise the tide.
    setupCardAbilities(ability) {
        this.reap({
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

AusteralisSeaborg.id = 'austeralis-seaborg';

export default AusteralisSeaborg;
