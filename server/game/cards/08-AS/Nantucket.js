const Card = require('../../Card.js');

class Nantucket extends Card {
    // After Fight/After Reap: Gain 1A for each of Nantucket’s Skyborn
    // neighbors.
    setupCardAbilities(ability) {
        this.reap({
            fight: true,
            gameAction: ability.actions.gainAmber((context) => ({
                amount: context.source.neighbors.filter((c) => c.hasHouse('skyborn')).length
            }))
        });
    }
}

Nantucket.id = 'nantucket';

module.exports = Nantucket;
