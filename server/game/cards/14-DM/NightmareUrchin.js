const Card = require('../../Card.js');

class NightmareUrchin extends Card {
    // After Reap: If you are overwhelmed, steal 2. Otherwise, steal 1.
    setupCardAbilities(ability) {
        this.reap({
            gameAction: ability.actions.steal((context) => ({
                amount: context.player.isOverwhelmed() ? 2 : 1
            }))
        });
    }
}

NightmareUrchin.id = 'nightmare-urchin';

module.exports = NightmareUrchin;
