import Card from '../../Card.js';

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

export default LibraryOfTheDamned;
