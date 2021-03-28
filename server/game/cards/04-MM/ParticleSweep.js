const Card = require('../../Card.js');

class ParticleSweep extends Card {
    setupCardAbilities(ability) {
        this.play({
            target: {
                mode: 'exactly',
                numCards: 1,
                cardType: 'creature',
                gameAction: [
                    ability.actions.destroy((context) => ({
                        target: context.target[0].hasTrait('mutant') ? context.target : []
                    })),
                    ability.actions.dealDamage((context) => ({
                        target: context.target[0].hasTrait('mutant') ? [] : context.target,
                        amount: 2
                    }))
                ]
            }
        });
    }
}

ParticleSweep.id = 'particle-sweep';

module.exports = ParticleSweep;
