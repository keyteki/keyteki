const Card = require('../../Card.js');

class HeartOfTheForest extends Card {
    setupCardAbilities(ability) {
        this.persistentEffect({
            targetController: 'any',
            effect: ability.effects.playerCannot('forge', (context => context.player.keys > context.player.opponent.keys))
        });
    }
}

HeartOfTheForest.id = 'heart-of-the-forest';

module.exports = HeartOfTheForest;
