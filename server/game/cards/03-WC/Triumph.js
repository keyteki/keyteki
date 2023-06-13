const Card = require('../../Card.js');

class Triumph extends Card {
    // Play: If there are no enemy creatures, exalt each friendly creature. If you do and there are 6 or more friendly creatures, forge a key at no cost.
    setupCardAbilities(ability) {
        this.play({
            condition: (context) =>
                context.player.opponent && context.player.opponent.creaturesInPlay.length === 0,
            gameAction: ability.actions.exalt((context) => ({
                target: context.player.creaturesInPlay
            })),
            then: {
                message: '{0} uses {1} to forge a key at no cost',
                condition: (context) => context.player.creaturesInPlay.length > 5,
                gameAction: ability.actions.forgeKey({
                    atNoCost: true
                })
            }
        });
    }
}

Triumph.id = 'triumph';

module.exports = Triumph;
