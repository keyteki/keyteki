const Card = require('../../Card.js');

class Salvay extends Card {
    setupCardAbilities(ability) {
        this.persistentEffect({
            effect: ability.effects.addKeyword((_, context) => {
                const neighbors = context.source.neighbors.filter((neighbor) =>
                    neighbor.hasHouse('redemption')
                );
                return { assault: neighbors.length * 2 };
            })
        });
    }
}

Salvay.id = 'salvay';

module.exports = Salvay;
