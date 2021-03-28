const Card = require('../../Card.js');

class BossZarek extends Card {
    setupCardAbilities(ability) {
        this.persistentEffect({
            targetController: 'current',
            match: (card) => card.amber,
            effect: ability.effects.addKeyword({ elusive: 1 })
        });
    }
}

BossZarek.id = 'boss-zarek';

module.exports = BossZarek;
