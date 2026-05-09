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
            then: (preThenContext) => {
                let damageEvents = [];
                const dealtFullDamage = () =>
                    damageEvents.some(
                        (event) =>
                            event.name === 'onDamageDealt' &&
                            !event.cancelled &&
                            event.amountApplied >= 2
                    );
                return {
                    alwaysTriggers: true,
                    gameAction: ability.actions.reveal((context) => {
                        damageEvents = context.preThenEvents || [];
                        return {
                            target: _.shuffle(
                                preThenContext.selects.player.choice === 'Mine'
                                    ? context.player.archives
                                    : context.player.opponent.archives
                            )[0],
                            chatMessage: true,
                            location: 'archives'
                        };
                    }),
                    then: {
                        // Inner then only fires when the reveal succeeded (a card was revealed
                        // from archives). The revealed card is always discarded; the additional
                        // 3 damage is only dealt if the initial 2 damage was fully applied.
                        gameAction: ability.actions.sequential([
                            ability.actions.dealDamage(() => ({
                                target: preThenContext.targets.creature,
                                amount: dealtFullDamage() ? 3 : 0
                            })),
                            ability.actions.discard((context) => ({
                                target: context.preThenEvent.card
                            }))
                        ]),
                        message: '{0} uses {1} to {3}discard {4}',
                        messageArgs: (context) => [
                            preThenContext.targets.creature && dealtFullDamage()
                                ? 'deal 3 more damage and '
                                : '',
                            context.preThenEvent.card
                        ]
                    }
                };
            }
        });
    }
}

HarmonicPack.id = 'harmonic-pack';

module.exports = HarmonicPack;
