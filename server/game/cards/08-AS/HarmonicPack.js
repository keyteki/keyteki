const _ = require('underscore');
const Card = require('../../Card.js');

class HarmonicPack extends Card {
    // Play: Deal 2D to a creature. Reveal a random card from a player's archives.
    // If you do, deal an additional 3D to the same creature. Discard the revealed card.
    setupCardAbilities(ability) {
        this.play({
            targets: {
                creature: {
                    cardType: 'creature',
                    gameAction: ability.actions.dealDamage({ amount: 2 })
                },
                player: {
                    mode: 'select',
                    activePromptTitle: "Which player's archives",
                    choices: {
                        Mine: () => true,
                        "Opponent's": (context) => !!context.player.opponent
                    }
                }
            },
            then: (preThenContext) => ({
                alwaysTriggers: true,
                gameAction: ability.actions.reveal((context) => ({
                    target: _.shuffle(
                        preThenContext.selects.player.choice === 'Mine'
                            ? context.player.archives
                            : context.player.opponent.archives
                    )[0],
                    chatMessage: true,
                    location: 'archives'
                })),
                then: {
                    gameAction: ability.actions.sequential([
                        ability.actions.dealDamage({
                            target: preThenContext.targets.creature,
                            amount: 3
                        }),
                        ability.actions.discard((context) => ({
                            target: context.preThenEvent.card
                        }))
                    ]),
                    message: '{0} uses {1} to {3}discard {4}',
                    messageArgs: (context) => [
                        preThenContext.targets.creature ? 'deal 3 more damage and ' : '',
                        context.preThenEvent.card
                    ]
                }
            })
        });
    }
}

HarmonicPack.id = 'harmonic-pack';

module.exports = HarmonicPack;
