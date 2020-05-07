const Card = require('../../Card.js');

class Commandeer extends Card {
    setupCardAbilities(ability) {
        this.play({
            effect: 'capture an aember after playing a card for the remainder of the turn',
            gameAction: ability.actions.forRemainderOfTurn(context => ({
                when: {
                    onCardPlayed: event => event.player === context.player
                },
                message: '{0} captures an aember due to {1}\'s effect',
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
