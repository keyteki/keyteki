import Card from '../../Card.js';

class TheoryOrConjecture extends Card {
    // Play: Choose one:
    // • Archive the top 2 cards of your deck.
    // • Play the top card of your deck.
    setupCardAbilities(ability) {
        this.play({
            target: {
                mode: 'select',
                choices: {
                    'Archive top 2 cards': ability.actions.archive((context) => ({
                        effect: 'archive the top two cards of their deck',
                        target: context.player.deck.slice(0, 2)
                    })),
                    'Play top card': ability.actions.playCard((context) => ({
                        revealOnIllegalTarget: true,
                        target: context.player.deck[0]
                    }))
                }
            }
        });
    }
}

TheoryOrConjecture.id = 'theory-or-conjecture';

export default TheoryOrConjecture;
