const Card = require('../../Card.js');

class PhalanxStrike extends Card {
    // Play: Choose a creature. Deal 1D to it for each friendly creature. You may exalt a friendly creature to repeat the preceding effect.
    setupCardAbilities(ability) {
        this.play({
            target: {
                cardType: 'creature',
                gameAction: ability.actions.dealDamage((context) => ({
                    amount: context.player.creaturesInPlay.length
                }))
            },
            effect: 'deal {1} damage to {2}',
            effectArgs: (context) => [context.player.creaturesInPlay.length, context.target],
            then: {
                alwaysTriggers: true,
                target: {
                    optional: true,
                    cardType: 'creature',
                    controller: 'self',
                    gameAction: ability.actions.exalt()
                },
                message: "{0} exalts {2} to repeat Phalanx Strike's effect",
                messageArgs: (context) => [context.target],
                then: {
                    target: {
                        cardType: 'creature',
                        gameAction: ability.actions.dealDamage((context) => ({
                            amount: context.player.creaturesInPlay.length
                        }))
                    },
                    message: '{0} uses {1} to deal {3} damage to {2}',
                    messageArgs: (context) => [
                        context.player.creaturesInPlay.length,
                        context.target
                    ]
                }
            }
        });
    }
}

PhalanxStrike.id = 'phalanx-strike';

module.exports = PhalanxStrike;
