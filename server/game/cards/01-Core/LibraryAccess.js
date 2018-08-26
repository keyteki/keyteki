const Card = require('../../Card.js');

class LibraryAccess extends Card {
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.forRemainderOfTurn(context => ({
                when: {
                    onCardPlayed: event => event.player === context.player
                },
                gameAction: ability.actions.draw(context => ({ target: context.player }))
            }))
        });
    }
}

LibraryAccess.id = 'library-access'; // This is a guess at what the id might be - please check it!!!

module.exports = LibraryAccess;
