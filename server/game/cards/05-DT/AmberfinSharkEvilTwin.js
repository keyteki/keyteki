const Card = require('../../Card.js');

class AmberfinSharkEvilTwin extends Card {
    // At the end of your turn, each player loses 1A. Give Æmberfin Shark a +1 power counter for each A lost this way.
    setupCardAbilities(ability) {
        this.interrupt({
            when: {
                onTurnEnd: (_, context) => context.player === this.game.activePlayer
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
                alwaysTriggers: true,
                gameAction: ability.actions.addPowerCounter((context) => ({
                    amount: context.preThenEvents.reduce(
                        (total, event) => total + (!event.cancelled ? event.amount : 0),
                        0
                    )
                }))
            }
        });
    }
}

AmberfinSharkEvilTwin.id = 'æmberfin-shark-evil-twin';

module.exports = AmberfinSharkEvilTwin;
