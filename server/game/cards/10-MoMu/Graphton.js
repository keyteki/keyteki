const Card = require('../../Card.js');

class Graphton extends Card {
    // After Reap: Archive the top card of your deck.
    setupCardAbilities(ability) {
        this.reap({
            effect: 'archive the top card of their deck',
            gameAction: ability.actions.archive((context) => ({
                target: context.player.deck.length > 0 ? context.player.deck[0] : []
            }))
        });
    }
}

Graphton.id = 'graphton';

module.exports = Graphton;
