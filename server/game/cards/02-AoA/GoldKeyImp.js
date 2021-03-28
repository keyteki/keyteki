const Card = require('../../Card.js');

class GoldKeyImp extends Card {
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
