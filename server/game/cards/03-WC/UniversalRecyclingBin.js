const Card = require('../../Card.js');

class UniversalRecycleBin extends Card {
    // Action: Archive a purged card you own.
    setupCardAbilities(ability) {
        this.action({
            target: {
                activePromptTitle: 'Choose which card to archive',
                location: 'purged',
                controller: 'self',
                gameAction: ability.actions.archive()
            }
        });
    }
}

UniversalRecycleBin.id = 'universal-recycle-bin';

module.exports = UniversalRecycleBin;
