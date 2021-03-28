const Card = require('../../Card.js');

class BronzeKeyImp extends Card {
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
