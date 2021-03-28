const Card = require('../../Card.js');

class MemoryChip extends Card {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onChooseActiveHouse: (event, context) =>
                    event.player === context.player && event.house === 'logos'
            },
            target: {
                location: 'hand',
                controller: 'self',
                gameAction: ability.actions.archive()
            }
        });
    }
}

MemoryChip.id = 'memory-chip';

module.exports = MemoryChip;
