const Card = require('../../Card.js');

class BossZarek extends Card {
    // Enhance PTPTPT. (These icons have already been added to cards in your deck.)
    // Each friendly creature with A on it gains elusive.
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
