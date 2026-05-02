const Card = require('../../Card.js');

class SedaTheSleeper extends Card {
    // While Seda the Sleeper is exhausted and on a flank, it gains invulnerable.
    // After you ready Seda the Sleeper, you may deal 2 to it. If you do, exhaust it.
    // Play: Capture 6.
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: (context) => context.source.exhausted && context.source.isOnFlank(),
            effect: ability.effects.addKeyword({ invulnerable: 1 })
        });

        this.reaction({
            when: {
                onCardReadied: (event, context) => event.card === context.source
            },
            optional: true,
            gameAction: ability.actions.dealDamage((context) => ({
                amount: 2,
                target: context.source
            })),
            then: {
                gameAction: ability.actions.exhaust((context) => ({ target: context.source }))
            },
            effect: 'deal 2 damage to {1} and exhaust it',
            effectArgs: (context) => [context.source]
        });

        this.play({
            gameAction: ability.actions.capture({ amount: 6, target: this }),
            effect: 'capture 6 amber'
        });
    }
}

SedaTheSleeper.id = 'seda-the-sleeper';

module.exports = SedaTheSleeper;
