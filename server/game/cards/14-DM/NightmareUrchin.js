const Card = require('../../Card.js');

class NightmareUrchin extends Card {
    // After Reap: If you are overwhelmed, steal 2A. Otherwise, steal 1A.
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
