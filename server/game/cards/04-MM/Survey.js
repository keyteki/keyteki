const Card = require('../../Card.js');

class Survey extends Card {
    setupCardAbilities(ability) {
        this.play({
            condition: context => context.player.deck.length > 0,
            gameAction: ability.actions.discard(context => ({
                promptWithHandlerMenu: {
                    activePromptTitle: 'Choose a card to discard',
                    cards: context.player.deck.slice(0, 2)
                }
            })),
            message: 'Choose to keep or discard top of deck.'
        });
    }
}

Survey.id = 'survey';

module.exports = Survey;
