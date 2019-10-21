const Card = require('../../Card.js');

class LibraryOfBabble extends Card {
    setupCardAbilities(ability) {
        this.action({
            gameAction: ability.actions.draw()
        });
    }
}

LibraryOfBabble.id = 'library-of-babble';

module.exports = LibraryOfBabble;
