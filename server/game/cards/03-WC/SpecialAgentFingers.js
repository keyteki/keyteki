const Card = require('../../Card.js');

class SpecialAgentFingers extends Card {
    // Elusive.
    // Action: Steal 1A.
    setupCardAbilities(ability) {
        this.action({
            gameAction: ability.actions.steal()
        });
    }
}

SpecialAgentFingers.id = 'special-agent-fingers';

module.exports = SpecialAgentFingers;
