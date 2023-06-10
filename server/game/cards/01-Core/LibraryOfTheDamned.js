const Card = require('../../Card.js');

class LibraryOfTheDamned extends Card {
    // Action: Archive a card.
    setupCardAbilities(ability) {
        this.action({
            target: {
                controller: 'self',
                location: 'hand',
                gameAction: ability.actions.archive()
            }
        });
    }
}

LibraryOfTheDamned.id = 'library-of-the-damned';

module.exports = LibraryOfTheDamned;
