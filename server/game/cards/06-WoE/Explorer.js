const Card = require('../../Card.js');

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
            effect: 'look at the top card of their deck',
            then: {
                alwaysTriggers: true,
                condition: (context) => !context.preThenEvent || context.preThenEvent.cancelled,
                message: '{0} uses {1} to leave it on top of their deck'
            }
        });
    }
}

Explorer.id = 'explorer';

module.exports = Explorer;
