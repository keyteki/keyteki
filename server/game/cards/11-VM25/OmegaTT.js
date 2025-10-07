import Card from '../../Card.js';

class OmegaTT extends Card {
    // Play: Purge 2 cards from a discard pile.
    // Action: Shuffle Omega TT into its owner's deck.
    setupCardAbilities(ability) {
        this.play({
            effectStyle: 'all',
            targets: {
                select: {
                    mode: 'select',
                    activePromptTitle: 'Choose which discard pile to purge from',
                    choices: {
                        Mine: (context) => context.player.discard.length > 0,
                        "Opponent's": (context) =>
                            context.player.opponent && context.player.opponent.discard.length > 0
                    }
                },
                cards: {
                    dependsOn: 'select',
                    mode: 'exactly',
                    numCards: 2,
                    cardCondition: (card, context) =>
                        context.selects.select.choice === 'Mine'
                            ? card.owner === context.player
                            : card.owner === context.player.opponent,
                    location: 'discard',
                    gameAction: ability.actions.purge()
                }
            }
        });

        this.action({
            gameAction: ability.actions.returnToDeck({ shuffle: true })
        });
    }
}

OmegaTT.id = 'omega-tt';

export default OmegaTT;
