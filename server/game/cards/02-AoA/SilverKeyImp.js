const Card = require('../../Card.js');

class SilverKeyImp extends Card {
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
