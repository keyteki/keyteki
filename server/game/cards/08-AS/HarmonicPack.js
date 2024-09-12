const Card = require('../../Card.js');

class HarmonicPack extends Card {
    setupCardAbilities(ability) {
        this.play({
            target: {
                cardType: 'creature',
                gameAction: ability.actions.dealDamage({ amount: 2 })
            },
            then: (thenContext) => ({
                alwaysTrigger: true,
                target: {
                    mode: 'select',
                    activePromptTitle: "Which player's archives",
                    choices: {
                        Mine: () => true,
                        "Opponent's": (context) => !!context.player.opponent
                    }
                },
                gameAction: ability.actions.discardAtRandom((context) => ({
                    amount: 1,
                    location: 'archives',
                    target:
                        !context.select || context.select === 'Mine'
                            ? context.player
                            : context.player.opponent
                })),
                then: {
                    gameAction: ability.actions.dealDamage({
                        target: thenContext.target,
                        amount: 3
                    })
                }
            })
        });
    }
}

HarmonicPack.id = 'harmonic-pack';

module.exports = HarmonicPack;
