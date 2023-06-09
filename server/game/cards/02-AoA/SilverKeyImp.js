const Card = require('../../Card.js');

class SilverKeyImp extends Card {
    // Elusive.(The first time this creature is attacked each turn, no damage is dealt.)
    // Players cannot forge their second key.
    setupCardAbilities(ability) {
        this.persistentEffect({
            targetController: 'any',
            effect: ability.effects.playerCannot(
                'forge',
                (context) => context.player.getForgedKeys() === 1
            )
        });
    }
}

SilverKeyImp.id = 'silver-key-imp';

module.exports = SilverKeyImp;
