import Card from '../../Card.js';

class Explorer extends Card {
    //Explorer: After Reap: Look at the top card of your deck. You may discard it.
    setupCardAbilities(ability) {
        this.reap({
            condition: (context) => context.player.deck.length > 0,
            gameAction: ability.actions.discard((context) => ({
                promptWithHandlerMenu: {
                    optional: true,
                    activePromptTitle: 'Select card to discard',
                    cards: [context.player.deck[0]],
                    choices: ['Leave on top of deck'],
                    handlers: [() => []]
                }
            })),
            message: 'Choose to keep or discard top of deck.'
        });
    }
}

Explorer.id = 'explorer';

export default Explorer;
