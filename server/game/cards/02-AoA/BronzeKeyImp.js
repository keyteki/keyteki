const Card = require('../../Card.js');

class BronzeKeyImp extends Card {
    // Elusive.(The first time this creature is attacked each turn, no damage is dealt.)
    // Players cannot forge their first key.
    setupCardAbilities(ability) {
        this.persistentEffect({
            targetController: 'any',
            effect: ability.effects.playerCannot(
                'forge',
                (context) => context.player.getForgedKeys() === 0
            )
        });
    }
}

BronzeKeyImp.id = 'bronze-key-imp';

module.exports = BronzeKeyImp;
