const Card = require('../../Card.js');

class DarkHeartOfTheForest extends Card {
    // Each haunted player skips their “forge a key” step.
    setupCardAbilities(ability) {
        this.persistentEffect({
            targetController: 'any',
            condition: (context) => context.game.activePlayer.isHaunted(),
            effect: ability.effects.skipStep('key')
        });
    }
}

DarkHeartOfTheForest.id = 'dark-heart-of-the-forest';

module.exports = DarkHeartOfTheForest;
