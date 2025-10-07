import Card from '../../Card.js';

class Wrecker extends Card {
    // After Reap: Discard the top card of a player’s deck.
    setupCardAbilities(ability) {
        this.reap({
            target: {
                mode: 'select',
                activePromptTitle: "Which player's deck",
                choices: {
                    Mine: () => true,
                    "Opponent's": (context) => !!context.player.opponent
                }
            },
            gameAction: ability.actions.discard((context) => ({
                target:
                    !context.select || context.select === 'Mine'
                        ? context.player.deck.slice(0, 1)
                        : context.player.opponent.deck.slice(0, 1)
            }))
        });
    }
}

Wrecker.id = 'wrecker';

export default Wrecker;
