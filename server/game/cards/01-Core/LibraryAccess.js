const Card = require('../../Card.js');

class LibraryAccess extends Card {
    setupCardAbilities(ability) {
        this.play({
            effect: 'draw a card after playing a card for the remainder of the turn, and purge {0}',
            gameAction: [
                ability.actions.forRemainderOfTurn((context) => ({
                    when: {
                        onCardPlayed: (event) =>
                            event.player === context.player && event.card !== context.source
                    },
                    gameAction: ability.actions.draw((context) => ({ target: context.player }))
                })),
                ability.actions.moveCard({ destination: 'purged' })
            ]
        });
    }
}

LibraryAccess.id = 'library-access';

module.exports = LibraryAccess;
