const Card = require('../../Card.js');

class Blypyp extends Card {
    setupCardAbilities(ability) {
        this.reap({
            effect: 'make the next Mars creature played this turn enter play ready',
            gameAction: ability.actions.forRemainderOfTurn(context => ({
                when: {
                    onCardPlayed: event => event.card.type === 'creature' && context.player === event.player && event.card.hasHouse('mars')
                },
                multipleTrigger: false,
                message: '{2} is readied due to {1}\'s effect',
                gameAction: ability.actions.ready()
            }))
        });
    }
}

Blypyp.id = 'blypyp';

module.exports = Blypyp;
