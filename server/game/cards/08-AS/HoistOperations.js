const Card = require('../../Card.js');

class HoistOperations extends Card {
    // Play: Put a creature into its owner’s archives.
    setupCardAbilities(ability) {
        this.play({
            target: {
                activePromptTitle: 'Choose a creature to archive',
                cardType: 'creature',
                controller: 'any',
                gameAction: ability.actions.putIntoArchives()
            }
        });
    }
}

HoistOperations.id = 'hoist-operations';

module.exports = HoistOperations;
