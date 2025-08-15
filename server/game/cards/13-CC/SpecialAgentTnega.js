const Card = require('../../Card.js');

class SpecialAgentTnega extends Card {
    // Special Agent Tnega gets +2 power for each of its Mars neighbors.
    setupCardAbilities(ability) {
        this.persistentEffect({
            effect: ability.effects.modifyPower(
                (card) => card.neighbors.filter((neighbor) => neighbor.hasHouse('mars')).length * 2
            )
        });
    }
}

SpecialAgentTnega.id = 'special-agent-tnega';

module.exports = SpecialAgentTnega;
