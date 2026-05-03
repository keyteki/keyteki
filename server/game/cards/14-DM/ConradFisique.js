const Card = require('../../Card.js');

class ConradFisique extends Card {
    // Enhance.
    // Play: You may move each +1 power counter from a creature to another
    // creature.
    setupCardAbilities(ability) {
        this.play({
            optional: true,
            targets: {
                source: {
                    cardType: 'creature',
                    gameAction: ability.actions.removePowerCounter({ all: true })
                },
                dest: {
                    dependsOn: 'source',
                    cardType: 'creature',
                    cardCondition: (card, context) => card !== context.targets.source,
                    gameAction: ability.actions.addPowerCounter((context) => ({
                        amount: context.targets.source
                            ? context.targets.source.tokens.power || 0
                            : 0
                    }))
                }
            },
            effect: 'move {1} +1 power {2} from {3}{4}',
            effectArgs: (context) => {
                const amount = (context.targets.source && context.targets.source.tokens.power) || 0;
                return [
                    amount,
                    amount === 1 ? 'counter' : 'counters',
                    context.targets.source,
                    context.targets.dest ? ' to ' + context.targets.dest.name : ''
                ];
            }
        });
    }
}

ConradFisique.id = 'cŏnrăd-fisiquĕ';

module.exports = ConradFisique;
