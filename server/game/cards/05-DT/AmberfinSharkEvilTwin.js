const Card = require('../../Card.js');

class AmberfinSharkEvilTwin extends Card {
    // At the end of your turn, each player loses 1A. Give Æmberfin Shark a +1 power counter for each A lost this way.
    setupCardAbilities(ability) {
        this.interrupt({
            when: {
                onRoundEnded: (event, context) => context.player === this.game.activePlayer
            },

            gameAction: [
                ability.actions.loseAmber((context) => ({
                    amount: 1,
                    target: context.player
                })),
                ability.actions.loseAmber((context) => ({
                    amount: 1,
                    target: context.player.opponent
                }))
            ],

            then: {
                gameAction: ability.actions.addPowerCounter((context) => ({
                    amount: context.preThenEvents
                        .filter((event) => event.name === 'onModifyAmber')
                        .reduce((total, event) => total + event.amount, 0)
                }))
            }
        });
    }
}

AmberfinSharkEvilTwin.id = 'æmberfin-shark-evil-twin';

module.exports = AmberfinSharkEvilTwin;
