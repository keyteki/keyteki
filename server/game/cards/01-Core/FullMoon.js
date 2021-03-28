const Card = require('../../Card.js');

class FullMoon extends Card {
    setupCardAbilities(ability) {
        this.play({
            effect: 'gain 1 amber for each creature played for the remainder of the turn',
            gameAction: ability.actions.forRemainderOfTurn((context) => ({
                when: {
                    onCardPlayed: (event) =>
                        event.player === context.player && event.card.type === 'creature'
                },
                gameAction: ability.actions.gainAmber((context) => ({ target: context.player }))
            }))
        });
    }
}

FullMoon.id = 'full-moon';

module.exports = FullMoon;
