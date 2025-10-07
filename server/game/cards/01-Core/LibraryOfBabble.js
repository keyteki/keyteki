import Card from '../../Card.js';

class LibraryOfBabble extends Card {
    // Action: Draw a card.
    setupCardAbilities(ability) {
        this.action({
            gameAction: ability.actions.draw()
        });
    }
}

LibraryOfBabble.id = 'library-of-babble';

export default LibraryOfBabble;
