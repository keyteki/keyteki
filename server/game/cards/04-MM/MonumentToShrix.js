const Card = require('../../Card.js');

class MonumentToShrix extends Card {
    // You may spend A on Monument to Shrix as if it were in your pool.
    // Action: Move 1A from your pool to Monument to Shrix. If Citizen Shrix is in your discard pile, move 1A from any players pool to Monument to Shrix instead.
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
