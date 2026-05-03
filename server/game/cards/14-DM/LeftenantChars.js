const Card = require('../../Card.js');

class LeftenantChars extends Card {
    // After Fight: If you are overwhelmed, steal 2A. Otherwise capture 1A.
    setupCardAbilities(ability) {
        this.fight({
            gameAction: ability.actions.conditional((context) => ({
                condition: context.player.isOverwhelmed(),
                trueGameAction: ability.actions.steal({ amount: 2 }),
                falseGameAction: ability.actions.capture({ amount: 1 })
            }))
        });
    }
}

LeftenantChars.id = 'leftenant-chars';

module.exports = LeftenantChars;
