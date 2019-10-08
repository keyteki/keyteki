const Card = require('../../Card.js');

class UniversalRecycleBin extends Card {
    setupCardAbilities(ability) {
        this.action({
            target: {
                location: 'purged',
                controller: 'self',
                gameAction: ability.actions.archive()
            }
        });
    }
}

UniversalRecycleBin.id = 'universal-recycle-bin';

module.exports = UniversalRecycleBin;
