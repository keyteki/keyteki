const Card = require('../../Card.js');

class RhetorGallim extends Card {
    // Play: Your opponents keys cost +3A during their next turn.
    // Reap: You may exalt Rhetor Gallim. If you do, your opponents keys cost +3A during their next turn.
    setupCardAbilities(ability) {
        this.play({
            effect: "increase {1}'s key cost by 3 during their next turn",
            effectArgs: (context) => context.player.opponent,
            gameAction: ability.actions.nextRoundEffect({
                targetController: 'opponent',
                effect: ability.effects.modifyKeyCost(3)
            })
        });

        this.reap({
            optional: true,
            gameAction: ability.actions.exalt(),
            then: {
                gameAction: ability.actions.nextRoundEffect({
                    targetController: 'opponent',
                    effect: ability.effects.modifyKeyCost(3)
                }),
                message: "{0} uses {1} to increase {3}'s key cost by 3 during their next turn",
                messageArgs: (context) => context.player.opponent
            }
        });
    }
}

RhetorGallim.id = 'rhetor-gallim';

module.exports = RhetorGallim;
