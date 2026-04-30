const Card = require('../../Card.js');

class OoniLars extends Card {
    // After Reap: You may pay your opponent 1A. If you do, your opponent's
    // keys cost +4 during their next turn.
    setupCardAbilities(ability) {
        this.reap({
            optional: true,
            gameAction: ability.actions.transferAmber((context) => ({
                target: context.player,
                amount: 1
            })),
            then: {
                gameAction: ability.actions.duringOpponentNextTurn({
                    targetController: 'opponent',
                    effect: ability.effects.modifyKeyCost(4)
                }),
                message: "{0} uses {1} to increase {2}'s key cost by 4 during their next turn",
                messageArgs: (context) => [context.player.opponent]
            }
        });
    }
}

OoniLars.id = 'ooni-lars';

module.exports = OoniLars;
