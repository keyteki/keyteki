const Card = require('../../Card.js');

class Replicator extends Card {
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
