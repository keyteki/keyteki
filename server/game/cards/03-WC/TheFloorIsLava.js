const Card = require('../../Card.js');

class TheFloorIsLava extends Card {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onPhaseStarted: (event, context) => event.phase === 'main' && context.player === this.game.activePlayer
            },
            gameAction:
            [
                ability.actions.dealDamage({
                    amount: 1,
                    promptForSelect: {
                        cardType: 'creature',
                        controller: 'self'
                    }
                }),
                ability.actions.dealDamage({
                    amount: 1,
                    promptForSelect: {
                        cardType: 'creature',
                        controller: 'opponent'
                    }
                })
            ]
        });
    }
}

TheFloorIsLava.id = 'the-floor-is-lava';

module.exports = TheFloorIsLava;
