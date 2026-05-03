const Card = require('../../Card.js');

class PrimeAuthority extends Card {
    // Play: Ready or exhaust a creature. If there are more exhausted friendly creatures than exhausted enemy creatures, gain 2A.
    setupCardAbilities(ability) {
        this.play({
            targets: {
                action: {
                    mode: 'select',
                    choices: {
                        'Ready a creature': () => true,
                        'Exhaust a creature': () => true
                    }
                },
                creature: {
                    dependsOn: 'action',
                    cardType: 'creature',
                    gameAction: ability.actions.conditional((context) => ({
                        condition: context.selects.action.choice === 'Ready a creature',
                        trueGameAction: ability.actions.ready({
                            target: context.targets.creature
                        }),
                        falseGameAction: ability.actions.exhaust({
                            target: context.targets.creature
                        })
                    }))
                }
            },
            effect: '{1} {2}',
            effectArgs: (context) => [
                context.selects.action.choice === 'Ready a creature' ? 'ready' : 'exhaust',
                context.targets.creature
            ],
            then: () => ({
                alwaysTriggers: true,
                condition: (context) =>
                    context.player.opponent &&
                    context.player.creaturesInPlay.filter((c) => c.exhausted).length >
                        context.player.opponent.creaturesInPlay.filter((c) => c.exhausted).length,
                gameAction: ability.actions.gainAmber({ amount: 2 }),
                message: '{0} gains 2 amber'
            })
        });
    }
}

PrimeAuthority.id = 'prime-authority';

module.exports = PrimeAuthority;
