const Card = require('../../Card.js');

class LibraryOfTheDamned extends Card {
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

LibraryOfTheDamned.id = 'library-of-the-damned'; // This is a guess at what the id might be - please check it!!!

module.exports = LibraryOfTheDamned;
