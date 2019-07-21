const Card = require('../../Card.js');

class SeismoEntangler extends Card {
    setupCardAbilities(ability) {
        this.action({
            target: {
                mode: 'house'
            },
            effect: 'stop creatures from {1} reaping next turn',
            effectArgs: context => context.house,
            gameAction: ability.actions.lastingEffect({
                targetController: 'opponent',
                effect: ability.effects.cardCannot('reap')
            })
        });
    }
}

SeismoEntangler.id = 'seismo-entangler';

module.exports = SeismoEntangler;
