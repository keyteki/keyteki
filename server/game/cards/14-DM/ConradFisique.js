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
                    cardCondition: (card) => card.hasToken('power'),
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
            }
        });
    }
}

ConradFisique.id = 'cŏnrăd-fisiquĕ';

module.exports = ConradFisique;
