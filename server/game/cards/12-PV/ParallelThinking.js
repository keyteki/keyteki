import Card from '../../Card.js';
import _ from 'underscore';

class ParallelThinking extends Card {
    // Play: Discard the top 2 cards of a player's deck or 2 random cards from a player's archives. If the discarded cards share a type, steal 2 amber.
    setupCardAbilities(ability) {
        this.play({
            target: {
                mode: 'select',
                activePromptTitle: 'Choose a location to discard cards from',
                choices: {
                    'My Deck': () => true,
                    'My Archives': () => true,
                    "Opponent's Deck": (context) => !!context.player.opponent,
                    "Opponent's Archives": (context) => !!context.player.opponent
                }
            },
            gameAction: ability.actions.discard((context) => ({
                target:
                    context.select && context.select.includes('Deck')
                        ? context.select.includes('My')
                            ? context.player.deck.slice(0, 2)
                            : context.player.opponent
                            ? context.player.opponent.deck.slice(0, 2)
                            : []
                        : context.select && context.select.includes('My')
                        ? _.shuffle(context.player.archives).slice(0, 2)
                        : context.player.opponent
                        ? _.shuffle(context.player.opponent.archives).slice(0, 2)
                        : []
            })),
            then: {
                condition: (context) => {
                    const cards = context.preThenEvents.map((event) => event.card);
                    return (
                        context.player.opponent &&
                        cards.length === 2 &&
                        cards[0].type === cards[1].type
                    );
                },
                gameAction: ability.actions.steal({ amount: 2 }),
                message: '{0} uses {1} to steal 2 amber from {3}',
                messageArgs: (context) => context.player.opponent
            }
        });
    }
}

ParallelThinking.id = 'parallel-thinking';

export default ParallelThinking;
