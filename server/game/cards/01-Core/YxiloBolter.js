const Card = require('../../Card.js');

class YxiloBolter extends Card {
    // Fight/Reap: Deal 2<D> to a creature. If this damage destroys that creature, purge it.
    setupCardAbilities(ability) {
        this.fight({
            reap: true,
            target: {
                cardType: 'creature',
                gameAction: ability.actions.dealDamage({ amount: 2 })
            },
            then: (preThenContext) => ({
                condition: (context) =>
                    context.preThenEvent.destroyEvent &&
                    context.preThenEvent.destroyEvent.destroyedByDamageDealt &&
                    context.preThenEvent.destroyEvent.resolved &&
                    context.preThenEvent.card.location === 'discard',
                gameAction: ability.actions.purge({ target: preThenContext.target }),
                message: '{0} uses {1} to purge {3}',
                messageArgs: () => [preThenContext.target]
            })
        });
    }
}

YxiloBolter.id = 'yxilo-bolter';

module.exports = YxiloBolter;
