import Card from '../../Card.js';

function firstCreatureInDiscard(context) {
    const player =
        !context.select || context.select === 'Mine' ? context.player : context.player.opponent;
    return player.discard.find((c) => c.type === 'creature');
}

class SoulExchange extends Card {
    // Play: Choose a player. Return the topmost creature from that
    // player’s discard pile to their hand. Destroy a creature
    // controlled by that player.
    setupCardAbilities(ability) {
        this.play({
            target: {
                mode: 'select',
                activePromptTitle: "Which player's discard",
                choices: {
                    Mine: () => true,
                    "Opponent's": (context) => !!context.player.opponent
                }
            },
            gameAction: ability.actions.conditional((context) => ({
                condition: !!firstCreatureInDiscard(context),
                trueGameAction: ability.actions.returnToHand({
                    location: 'discard',
                    target: firstCreatureInDiscard(context)
                })
            })),
            effect: "return {1} to {2}'s hand",
            effectArgs: (context) => [
                firstCreatureInDiscard(context) ? firstCreatureInDiscard(context) : 'no creature',
                !context.select || context.select === 'Mine'
                    ? context.player
                    : context.player.opponent
            ],
            then: (preThenContext) => ({
                alwaysTriggers: true,
                target: {
                    controller:
                        !preThenContext.select || preThenContext.select === 'Mine'
                            ? 'self'
                            : 'opponent',
                    cardType: 'creature',
                    gameAction: ability.actions.destroy()
                },
                message: '{0} uses {1} to destroy {3}',
                messageArgs: (context) => [context.target]
            })
        });
    }
}

SoulExchange.id = 'soul-exchange';

export default SoulExchange;
