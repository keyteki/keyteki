import Card from '../../Card.js';

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

export default SpecialAgentFingers;
