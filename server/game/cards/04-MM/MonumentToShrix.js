const Card = require('../../Card.js');

class MonumentToShrix extends Card {
    setupCardAbilities(ability) {
        this.persistentEffect({
            effect: ability.effects.keyAmber()
        });

        this.action({
            useCondition: (context) =>
                !context.player.discard.some((card) => card.name === 'Citizen Shrix'),
            effect: 'move one amber from their pool to Monument to Shrix',
            gameAction: ability.actions.loseAmber((context) => ({
                target: context.player
            })),
            then: {
                gameAction: ability.actions.placeAmber()
            }
        });

        this.action({
            useCondition: (context) =>
                context.player.discard.some((card) => card.name === 'Citizen Shrix'),
            target: {
                mode: 'select',
                activePromptTitle: "Which player's pool",
                choices: {
                    Mine: () => true,
                    "Opponent's": (context) => !!context.player.opponent
                }
            },
            effect: 'move one amber from {1} pool to Monument to Shrix',
            effectArgs: (context) => [context.select === 'Mine' ? 'their' : "their opponent's"],
            gameAction: ability.actions.loseAmber((context) => ({
                target:
                    !context.select || context.select === 'Mine'
                        ? context.player
                        : context.player.opponent
            })),
            then: {
                gameAction: ability.actions.placeAmber()
            }
        });
    }
}

MonumentToShrix.id = 'monument-to-shrix';

module.exports = MonumentToShrix;
