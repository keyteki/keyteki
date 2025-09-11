const Card = require('../../Card.js');

class EmeritusDarn extends Card {
    // Elusive.
    // After Reap: Archive the top 2 cards of your deck.
    setupCardAbilities(ability) {
        this.reap({
            effect: 'archive the top 2 cards of their deck',
            gameAction: ability.actions.archive((context) => ({
                target: context.player.deck.slice(0, 2)
            }))
        });
    }
}

EmeritusDarn.id = 'emeritus-darn';

module.exports = EmeritusDarn;
