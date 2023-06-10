const Card = require('../../Card.js');

class GoldKeyImp extends Card {
    // Elusive.(The first time this creature is attacked each turn, no damage is dealt.)
    // Players cannot forge their third key.
    setupCardAbilities(ability) {
        this.persistentEffect({
            targetController: 'any',
            effect: ability.effects.playerCannot(
                'forge',
                (context) => context.player.getForgedKeys() === 2
            )
        });
    }
}

GoldKeyImp.id = 'gold-key-imp';

module.exports = GoldKeyImp;
