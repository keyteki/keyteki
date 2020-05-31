const Card = require('../../Card.js');

class SeismoEntangler extends Card {
    setupCardAbilities(ability) {
        this.action({
            target: {
                mode: 'house'
            },
            effect: 'stop {1} creatures from reaping next turn',
            effectArgs: (context) => context.house,
            gameAction: ability.actions.lastingEffect((context) => ({
                targetController: 'opponent',
                effect: ability.effects.cardCannot('reap', (cannotContext) =>
                    cannotContext.source.hasHouse(context.house)
                )
            }))
        });
    }
}

SeismoEntangler.id = 'seismo-entangler';

module.exports = SeismoEntangler;
