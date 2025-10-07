import Card from '../../Card.js';

class Minion extends Card {
    // After Reap: Put the top card of a haunted player’s discard pile
    // on top of its owner’s deck.
    setupCardAbilities(ability) {
        this.reap({
            condition: (context) =>
                context.player.isHaunted() ||
                (context.player.opponent && context.player.opponent.isHaunted()),
            target: {
                mode: 'select',
                activePromptTitle: "Which player's discard",
                choices: {
                    Mine: (context) => context.player.isHaunted(),
                    "Opponent's": (context) =>
                        context.player.opponent && context.player.opponent.isHaunted()
                }
            },
            gameAction: ability.actions.returnToDeck((context) => ({
                target:
                    !context.select || context.select === 'Mine'
                        ? context.player.discard.slice(0, 1)
                        : context.player.opponent.discard.slice(0, 1)
            }))
        });
    }
}

Minion.id = 'minion';

export default Minion;
