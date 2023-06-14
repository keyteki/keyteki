const Card = require('../../Card.js');

class Replicator extends Card {
    // Reap: Trigger the reap effect of another creature in play as if you controlled that creature. (That creature does not exhaust.)
    setupCardAbilities(ability) {
        this.reap({
            target: {
                cardType: 'creature',
                cardCondition: (card, context) => card !== context.source,
                gameAction: ability.actions.resolveAbility({
                    ability: (ability) => ability.isReap()
                })
            }
        });
    }
}

Replicator.id = 'replicator';

module.exports = Replicator;
