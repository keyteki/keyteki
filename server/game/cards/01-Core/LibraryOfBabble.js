const Card = require('../../Card.js');

class LibraryOfBabble extends Card {
    setupCardAbilities(ability) {
        this.action({
            gameAction: ability.actions.draw()
        });
    }
}

LibraryOfBabble.id = 'library-of-babble'; // This is a guess at what the id might be - please check it!!!

module.exports = LibraryOfBabble;
