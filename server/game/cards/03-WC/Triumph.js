const Card = require('../../Card.js');

class Triumph extends Card {
    setupCardAbilities(ability) {
        this.play({
            condition: (context) =>
                context.player.opponent && context.player.opponent.creaturesInPlay.length === 0,
            gameAction: ability.actions.exalt((context) => ({
                target: context.player.creaturesInPlay
            })),
            then: {
                message: '{0} uses {1} to forge a key at current cost',
                condition: (context) => context.player.creaturesInPlay.length > 5,
                gameAction: ability.actions.forgeKey((context) => ({
                    modifier: -context.player.getCurrentKeyCost()
                }))
            }
        });
    }
}

Triumph.id = 'triumph';

module.exports = Triumph;
