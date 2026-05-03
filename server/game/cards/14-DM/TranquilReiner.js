const Card = require('../../Card.js');

class TranquilReiner extends Card {
    // Tranquil Reiner does not ready during your "ready cards" step.
    // After Fight/After Reap: Ready an exhausted non-Dragon creature. If you do, gain 3A.
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: (card, context) => card === context.source,
            effect: ability.effects.doesNotReady()
        });

        this.fight({
            reap: true,
            target: {
                cardType: 'creature',
                controller: 'any',
                cardCondition: (card) => card.exhausted && !card.hasTrait('dragon'),
                gameAction: ability.actions.ready()
            },
            then: {
                gameAction: ability.actions.gainAmber({ amount: 3 })
            },
            effect: 'ready {0}'
        });
    }
}

TranquilReiner.id = 'tranquil-reiner';

module.exports = TranquilReiner;
