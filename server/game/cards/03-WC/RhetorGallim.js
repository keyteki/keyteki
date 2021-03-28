const Card = require('../../Card.js');

class RhetorGallim extends Card {
    setupCardAbilities(ability) {
        this.play({
            effect: "increase {1}'s key cost by 3 until the end of their next turn",
            effectArgs: (context) => context.player.opponent,
            gameAction: ability.actions.lastingEffect({
                targetController: 'opponent',
                effect: ability.effects.modifyKeyCost(3)
            })
        });

        this.reap({
            optional: true,
            gameAction: ability.actions.exalt(),
            then: {
                gameAction: ability.actions.lastingEffect({
                    targetController: 'opponent',
                    effect: ability.effects.modifyKeyCost(3)
                }),
                message: "{1} increases {3}'s key cost by 3 until the end of their next turn",
                messageArgs: (context) => context.player.opponent
            }
        });
    }
}

RhetorGallim.id = 'rhetor-gallim';

module.exports = RhetorGallim;
