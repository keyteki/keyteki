const Card = require('../../Card.js');

class Fetchdrones extends Card {
    setupCardAbilities(ability) {
        this.action({
            gameAction: ability.actions.discard(context => ({
                target: context.player.deck.length > 0 ? context.player.deck.slice(0, Math.min(2, context.player.deck.length)) : []
            })),
            then: preThenContext => {
                let cards = preThenContext.player.deck.length > 0 ? preThenContext.player.deck.slice(0, Math.min(2, preThenContext.player.deck.length)) : [];
                return {
                    condition: () => cards.filter(card => card.hasHouse('logos')).length > 0,
                    target: {
                        mode: 'exactly',
                        controller: 'self',
                        numCards: () => cards.filter(card => card.hasHouse('logos')).length,
                        gameAction: ability.actions.capture({ amount: 2})
                    }
                };
            }
        });
    }
}

Fetchdrones.id = 'fetchdrones';

module.exports = Fetchdrones;
