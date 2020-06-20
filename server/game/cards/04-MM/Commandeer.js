const Card = require('../../Card.js');

class Commandeer extends Card {
    setupCardAbilities(ability) {
        this.play({
            effect: 'capture an amber after playing a card for the remainder of the turn',
            gameAction: ability.actions.forRemainderOfTurn((context) => ({
                when: {
                    onCardPlayed: (event) =>
                        event.player === context.player && event.card !== context.source
                },
                gameAction: ability.actions.capture({
                    promptForSelect: {
                        cardType: 'creature',
                        controller: 'self'
                    }
                })
            }))
        });
    }
}

Commandeer.id = 'commandeer';

module.exports = Commandeer;
