const Card = require('../../Card.js');

class LibraryOfPolliasaurus extends Card {
    setupCardAbilities(ability) {
        this.action({
            target: {
                cardType: 'creature',
                controller: 'self',
                cardCondition: (card) => card.hasToken('amber'),
                gameAction: ability.actions.removeAmber()
            },
            then: {
                gameAction: ability.actions.gainAmber()
            }
        });
    }
}

LibraryOfPolliasaurus.id = 'library-of-polliasaurus';

module.exports = LibraryOfPolliasaurus;
