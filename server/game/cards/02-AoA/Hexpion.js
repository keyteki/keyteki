const Card = require('../../Card.js');

class Hexpion extends Card {
    // Destroyed: Archive Hexpion and the top card of your deck.
    setupCardAbilities(ability) {
        this.destroyed({
            effect: 'archive {0} and the top card of their deck',
            gameAction: [
                ability.actions.archive(),
                ability.actions.archive((context) => ({
                    target: context.player.deck.length > 0 ? context.player.deck[0] : []
                }))
            ]
        });
    }
}

Hexpion.id = 'hexpion';

module.exports = Hexpion;
