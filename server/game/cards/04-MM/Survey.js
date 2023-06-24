const Card = require('../../Card.js');

class Survey extends Card {
    // Enhance R. (These icons have already been added to cards in your deck.)
    // Play: Look at the top 2 cards of your deck. Discard 1 of them.
    setupCardAbilities(ability) {
        this.play({
            preferActionPromptMessage: true,
            condition: (context) => context.player.deck.length > 0,
            gameAction: ability.actions.discard((context) => ({
                promptWithHandlerMenu: {
                    activePromptTitle: 'Choose a card to discard',
                    message: '{0} uses {1} to discard {2}',
                    messageArgs: (cards) => [context.player, context.source, cards[0]],
                    cards: context.player.deck.slice(0, 2)
                }
            }))
        });
    }
}

Survey.id = 'survey';

module.exports = Survey;
