import Card from '../../Card.js';

class SuggestionBox extends Card {
    // This creature gains, “After Reap: Look at the top 5 cards of
    // your deck. Add 1 to your hand and discard the others.”
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: ability.effects.gainAbility('reap', {
                preferActionPromptMessage: true,
                condition: (context) => context.player.deck.length > 0,
                gameAction: ability.actions.moveCard((context) => ({
                    promptWithHandlerMenu: {
                        activePromptTitle: 'Choose a card to add to hand (discarding the others)',
                        message: '{0} uses {1} to add a card to hand',
                        messageArgs: (cards) => [context.player, context.source, cards[0]],
                        cards: context.player.deck.slice(0, 5)
                    },
                    destination: 'hand'
                })),
                then: {
                    gameAction: ability.actions.discard((context) => ({
                        target: context.player.deck.slice(0, 4)
                    })),
                    messageArgs: (context) => [context.player.deck.slice(0, 4)]
                }
            })
        });
    }
}

SuggestionBox.id = 'suggestion-box';

export default SuggestionBox;
