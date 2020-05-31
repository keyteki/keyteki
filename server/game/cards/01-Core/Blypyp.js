const Card = require('../../Card.js');

class Blypyp extends Card {
    setupCardAbilities(ability) {
        this.reap({
            effect: 'make the next Mars creature played this turn enter play ready',
            gameAction: ability.actions.forRemainderOfTurn((context) => ({
                when: {
                    onCardPlayed: (event) =>
                        event.card.type === 'creature' &&
                        context.player === event.player &&
                        event.card.hasHouse('mars')
                },
                multipleTrigger: false,
                gameAction: ability.actions.ready((context) => ({ target: context.event.card }))
            }))
        });
    }
}

Blypyp.id = 'blypyp';

module.exports = Blypyp;
