const Card = require('../../Card.js');

class Philophosaurus extends Card {
    setupCardAbilities(ability) {
        this.reap({
            condition: context => context.player.deck.length > 0,
            gameAction: ability.actions.archive(context => ({
                promptWithHandlerMenu: {
                    activePromptTitle: 'Choose which card to archive',
                    cards: context.player.deck.slice(0, 3),
                    message: '{0} chooses to add {2} to their archives'
                }
            })),
            then: {
                condition: context => context.player.deck.length > 0,
                gameAction: ability.actions.moveCard(context => ({
                    destination: 'hand',
                    promptWithHandlerMenu: {
                        activePromptTitle: 'Choose a card to add to hand',
                        cards: context.player.deck.slice(0, 2),
                        message: '{0} chooses to add {2} to their hand'
                    }
                })),
                then: {
                    condition: context => context.player.deck.length > 0,
                    gameAction: ability.actions.discard(context => ({
                        target: context.player.deck[0]
                    }))
                }
            }
        });
    }
}

Philophosaurus.id = 'philophosaurus';

module.exports = Philophosaurus;
