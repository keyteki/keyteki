const Card = require('../../Card.js');

class SeismoEntangler extends Card {
    // Action: Choose a house. During your opponents next turn, creatures of the chosen house cannot be used to reap.
    setupCardAbilities(ability) {
        this.action({
            target: {
                mode: 'house'
            },
            effect: 'stop {1} creatures from reaping next turn',
            effectArgs: (context) => context.house,
            effectAlert: true,
            gameAction: ability.actions.nextRoundEffect((context) => ({
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
