const Card = require('../../Card.js');

class Eyegor extends Card {
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.moveCard(context => ({
                destination: 'hand',
                promptWithHandlerMenu: {
                    activePromptTitle: 'Choose a card to add to hand',
                    cards: context.player.deck.slice(0, 3),
                    message: '{0} chooses to add {2} to their hand'
                }
            })),
            then: {
                gameAction: ability.actions.discard(context => ({
                    target: context.player.deck.slice(0, 2)
                }))
            }
        });
    }
}

Eyegor.id = 'eyegor';

module.exports = Eyegor;
