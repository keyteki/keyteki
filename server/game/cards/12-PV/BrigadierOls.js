const Card = require('../../Card.js');

class BrigadierOls extends Card {
    // Enhance .
    // Brigadier Ols gets +2 armor for each of its Sanctum neighbors.
    setupCardAbilities(ability) {
        this.persistentEffect({
            effect: ability.effects.modifyArmor((card) => {
                return card.neighbors.filter((neighbor) => neighbor.hasHouse('sanctum')).length * 2;
            })
        });
    }
}

BrigadierOls.id = 'brigadier-ols';

module.exports = BrigadierOls;
