const Card = require('../../Card.js');

class HeartOfTheForest extends Card {
    setupCardAbilities(ability) {
        this.persistentEffect({
            targetController: 'any',
            effect: ability.effects.playerCannot(
                'forge',
                (context) =>
                    context.player.opponent &&
                    context.player.getForgedKeys() > context.player.opponent.getForgedKeys()
            )
        });
    }
}

HeartOfTheForest.id = 'heart-of-the-forest';

module.exports = HeartOfTheForest;
