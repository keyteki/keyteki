const Card = require('../../Card.js');

class Digitallia extends Card {
    // Enhance 1.
    // After Reap: Draw a card for each of Digitallia's Logos neighbors.
    setupCardAbilities(ability) {
        this.reap({
            effect: 'draw a card for each of its Logos neighbors',
            gameAction: ability.actions.draw((context) => ({
                amount: context.source.neighbors.filter((card) => card.hasHouse('logos')).length
            }))
        });
    }
}

Digitallia.id = 'digitallia';

module.exports = Digitallia;
