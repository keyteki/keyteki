const Card = require('../../Card.js');

class HarmonicPack extends Card {
    // Play: Deal 2D to a creature. Reveal a random card from a player's archives.
    // If you do, deal an additional 3D to the same creature. Discard the revealed card.
    setupCardAbilities(ability) {
        this.play({
            target: {
                cardType: 'creature',
                gameAction: ability.actions.dealDamage({ amount: 2 })
            },
            then: (thenContext) => ({
                alwaysTriggers: true,
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
